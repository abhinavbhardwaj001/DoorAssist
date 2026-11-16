import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID"),

  scheduledAt: z.coerce
    .date()
    .refine((date) => date > new Date(), "Booking date must be in the future"),

  address: z.object({
    addressLine: z.string().trim().min(5).max(200),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian pincode"),
  }),

  customerNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export const rejectBookingSchema = z.object({
  rejectionReason: z.string().trim().min(5).max(500),
});

export const cancelBookingSchema = z.object({
  cancellationReason: z.string().trim().min(5).max(500),
});
