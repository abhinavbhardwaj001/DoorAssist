import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const isProd = env.nodeEnv === "production";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: isProd ? 25 : 1000, // Relaxed locally; reasonable ceiling in production
  skip: () => !isProd, // Bypass completely in local development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: isProd ? 20 : 1000,
  skip: () => !isProd,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a few minutes and try again.",
  },
});
