import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),

  description: z.string().trim().max(500).optional().or(z.literal("")),

  image: z.string().trim().optional().or(z.literal("")),
});

export const categoryIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID");
  
export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),

    description: z.string().trim().max(500).optional().or(z.literal("")),

    image: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const updateCategoryStatusSchema = z.object({
  isActive: z.boolean(),
});
