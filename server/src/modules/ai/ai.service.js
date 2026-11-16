import { GoogleGenAI, Type } from "@google/genai";
import Category from "../categories/category.model.js";
import Service from "../services/service.model.js";
import env from "../../config/env.js";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

const DIAGNOSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categoryId: { type: Type.STRING },
    categoryName: { type: Type.STRING },
    diagnosis: { type: Type.STRING },
    urgency: { type: Type.STRING },
    safetyTip: { type: Type.STRING },
  },
  required: ["categoryId", "categoryName", "diagnosis", "urgency"],
};

const SERVICE_COPY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
  },
  required: ["description"],
};

export const analyzeHomeIssue = async (problem) => {
  const categories = await Category.find({ isActive: true })
    .select("_id name description")
    .lean();

  if (!categories.length) {
    const error = new Error(
      "No active service categories available right now.",
    );
    error.statusCode = 404;
    throw error;
  }

  const categoryNames = categories.map((c) => c.name);

  const categoryContext = categories
    .map(
      (c) =>
        `- Name: "${c.name}" | Info: ${c.description || "General home service"}`,
    )
    .join("\n");

  const dynamicDiagnosisSchema = {
    type: Type.OBJECT,
    properties: {
      categoryName: {
        type: Type.STRING,
        enum: categoryNames,
      },
      diagnosis: { type: Type.STRING },
      urgency: {
        type: Type.STRING,
        enum: ["low", "medium", "high"],
      },
      safetyTip: { type: Type.STRING },
    },
    required: ["categoryName", "diagnosis", "urgency"],
  };

  let recommendation;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are DoorAssist's smart home-service assistant in India.
A homeowner described this issue: "${problem}"

Available DoorAssist Categories:
${categoryContext}

Pick the single best matching categoryName from the available categories above based on the homeowner's actual technical or home-service need (for example, electrical/solar issues should match Electrical or Solar rather than Interior Design). Give a brief 1-2 sentence helpful diagnosis/advice, rate urgency (low, medium, or high), and optionally include a short safetyTip if relevant.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: dynamicDiagnosisSchema,
      },
    });

    recommendation = JSON.parse(response.text);
  } catch {
    const error = new Error(
      "Unable to analyze your request right now. Please try browsing services manually.",
    );
    error.statusCode = 502;
    throw error;
  }

  const resolvedCategory =
    categories.find(
      (c) =>
        c.name.trim().toLowerCase() ===
        String(recommendation.categoryName || "")
          .trim()
          .toLowerCase(),
    ) || categories[0];

  const matchedServices = await Service.find({
    isActive: true,
    categoryId: resolvedCategory._id,
  })
    .select("name pricingType price durationMinutes image providerId")
    .populate("providerId", "businessName ratingAverage")
    .limit(3)
    .lean();

  return {
    recommendation: {
      categoryId: String(resolvedCategory._id),
      categoryName: resolvedCategory.name,
      diagnosis: recommendation.diagnosis,
      urgency: recommendation.urgency,
      safetyTip: recommendation.safetyTip || "",
    },
    matchedServices,
  };
};

export const generateServiceListingCopy = async ({
  name,
  categoryName,
  notes,
}) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are helping a local service provider on DoorAssist (an Indian home services marketplace) write a clear, trustworthy service listing description.

Service Name: "${name}"
${categoryName ? `Category: "${categoryName}"` : ""}
${notes ? `Provider's Rough Notes: "${notes}"` : ""}

Write a single cohesive, customer-friendly paragraph (strictly 2 to 4 sentences, between 150 and 600 characters).
Rules:
- Plain prose paragraph ONLY.
- Do NOT use bullet points, numbered lists, dashes, symbols, or line breaks.
- Naturally weave what is included, key benefits, and professionalism into flowing sentences.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SERVICE_COPY_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text);

    // Strip any bullet symbols or line breaks into a single clean paragraph
    const paragraphDescription = String(parsed.description || "")
      .replace(/[•▪◦●*-]\s*/g, "")
      .replace(/\s*\n+\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 950);

    return {
      description: paragraphDescription,
    };
  } catch {
    const error = new Error(
      "Unable to generate service description right now. Please write it manually.",
    );
    error.statusCode = 502;
    throw error;
  }
};
