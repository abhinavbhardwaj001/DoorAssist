import { z } from "zod";

export const providerApplicationSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  experienceYears: z.preprocess(
    (value) => (value === "" ? Number.NaN : value),
    z.coerce
      .number()
      .int("Experience must be a whole number")
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years"),
  ),
  serviceAreas: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    z
      .array(
        z.object({
          city: z.string().trim().min(2, "City is required").max(100),
          state: z.string().trim().min(2, "State is required").max(100),
        }),
      )
      .min(1, "At least one service area is required"),
  ),
});

export const providerIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID");

export const rejectProviderApplicationSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(3, "Rejection reason must be at least 3 characters")
    .max(500, "Rejection reason must not exceed 500 characters"),
});

export const updateProviderProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(100).optional(),

  description: z.string().trim().max(1000).optional(),

  experienceYears: z.coerce.number().int().min(0).max(60).optional(),

  serviceAreas: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    z
      .array(
        z.object({
          city: z.string().trim().min(2).max(100),
          state: z.string().trim().min(2).max(100),
        }),
      )
      .min(1)
      .optional(),
  ),
});

export const updateAvailabilitySchema = z
  .object({
    availability: z
      .array(
        z
          .object({
            dayOfWeek: z.number().int().min(0).max(6),
            startTime: z
              .string()
              .regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "Start time must be in HH:mm format",
              ),
            endTime: z
              .string()
              .regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "End time must be in HH:mm format",
              ),
          })
          .refine((day) => day.endTime > day.startTime, {
            message: "End time must be later than start time",
            path: ["endTime"],
          }),
      )
      .max(7, "Availability cannot contain more than 7 days"),
  })
  .refine(
    (data) =>
      new Set(data.availability.map((day) => day.dayOfWeek)).size ===
      data.availability.length,
    {
      message: "Each day of the week can be added only once",
      path: ["availability"],
    },
  );
