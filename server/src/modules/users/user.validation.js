import { z } from "zod";

export const getAllUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(Number.MAX_SAFE_INTEGER).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  role: z.enum(["customer", "provider", "admin"]).optional(),

  status: z.enum(["active", "suspended", "blocked"]).optional(),

  search: z
    .string()
    .trim()
    .max(100, "Search must not exceed 100 characters")
    .optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["active", "suspended", "blocked"]),
});
