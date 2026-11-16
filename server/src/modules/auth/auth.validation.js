import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must not exceed 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Please provide a valid Indian phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password must not exceed 72 characters")
      .refine(
        (value) => value.trim().length > 0,
        "Password cannot contain only whitespace",
      ),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .max(72, "Password must not exceed 72 characters"),
  })
  .strict();

export const verifyEmailSchema = z.object({
  email: z.string().trim().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resendVerificationOtpSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .max(254),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .max(254),

    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password must not exceed 72 characters")
      .refine(
        (value) => value.trim().length > 0,
        "Password cannot contain only whitespace",
      ),
  })
  .strict();
