import { z } from "zod";

const diagnoseHomeIssueSchema = z.object({
  problem: z
    .string({
      required_error: "Problem description is required.",
      invalid_type_error: "Problem description must be text.",
    })
    .trim()
    .min(5, "Please describe your home issue in at least 5 characters.")
    .max(500, "Please keep your problem description under 500 characters."),
});

const generateServiceCopySchema = z.object({
  name: z
    .string({
      required_error: "Service name is required.",
      invalid_type_error: "Service name must be text.",
    })
    .trim()
    .min(2, "Enter a service name first (at least 2 characters).")
    .max(150, "Service name must be under 150 characters."),
  categoryName: z.string().trim().max(100).optional().default(""),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be under 500 characters.")
    .optional()
    .default(""),
});

export const validateDiagnoseRequest = (data) => {
  return diagnoseHomeIssueSchema.parse(data);
};

export const validateServiceCopyRequest = (data) => {
  return generateServiceCopySchema.parse(data);
};
