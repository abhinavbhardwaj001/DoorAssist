import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";
import { AUTH_CONSTANTS } from "../modules/auth/auth.constants.js";

// Generate access token
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId.toString() }, env.accessTokenSecret, {
    expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId.toString() }, env.refreshTokenSecret, {
    expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
};

// Generate SHA-256 hash of refresh token
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.refreshTokenSecret, { algorithms: ["HS256"] });
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }
};