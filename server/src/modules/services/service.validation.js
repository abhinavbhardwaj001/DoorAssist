import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

const pricingTypeSchema = z.enum(["fixed", "starting_from", "on_request"]);

const priceSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional(),
);

const durationSchema = z.coerce.number().int().min(15);

export const pricingFieldsSchema = z
  .object({
    pricingType: pricingTypeSchema,
    price: priceSchema,
  })
  .superRefine((data, ctx) => {
    if (data.pricingType !== "on_request" && data.price === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Price is required for this pricing type",
      });
    }

    if (data.pricingType === "on_request" && data.price !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Price must be omitted for on-request services",
      });
    }
  });

export const createServiceSchema = z
  .object({
    categoryId: objectIdSchema,

    name: z.string().trim().min(2).max(150),

    description: z.string().trim().max(1000).optional().or(z.literal("")),

    pricingType: pricingTypeSchema,

    price: priceSchema,

    durationMinutes: durationSchema,
  })
  .superRefine((data, ctx) => {
    const result = pricingFieldsSchema.safeParse({
      pricingType: data.pricingType,
      price: data.price,
    });

    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue(issue);
      }
    }
  });

export const updateServiceSchema = z
  .object({
    categoryId: objectIdSchema.optional(),

    name: z.string().trim().min(2).max(150).optional(),

    description: z.string().trim().max(1000).optional().or(z.literal("")),

    pricingType: pricingTypeSchema.optional(),

    price: priceSchema,

    durationMinutes: z.coerce.number().int().min(15).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const updateServiceStatusSchema = z.object({
  isActive: z.boolean(),
});
