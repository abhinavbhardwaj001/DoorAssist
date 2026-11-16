import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  registerUser,
  verifyEmailOtp,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service.js";
import env from "../../config/env.js";
import { AUTH_CONSTANTS } from "./auth.constants.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "strict",
  path: "/",
};

const setRefreshCookie = (res, token) => {
  res.cookie(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME, token, {
    ...refreshCookieOptions,
    maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_MAX_AGE,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(
    AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME,
    refreshCookieOptions,
  );
};

// Register controller
export const register = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = registerSchema.parse(req.body);

    // 2. Call registration service
    const user = await registerUser(validatedData);

    // 3. Send successful response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const validatedData = verifyEmailSchema.parse(req.body);
    const result = await verifyEmailOtp(validatedData);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = resendVerificationOtpSchema.parse(req.body);
    const result = await resendVerificationOtp(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await resetPassword(validatedData);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Login controller
export const login = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = loginSchema.parse(req.body);

    // 2. Get request information
    const userAgent = req.get("user-agent");

    const ip = req.ip || req.socket.remoteAddress;

    // 3. Call login service
    const result = await loginUser({
      ...validatedData,
      userAgent,
      ip,
    });

    // 4. Set refresh token in HTTP-only cookie
    setRefreshCookie(res, result.refreshToken);

    // 5. Return response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token controller
export const refresh = async (req, res, next) => {
  try {
    // Read refresh token from cookie
    const refreshToken = req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    // Generate a new access token
    const result = await refreshAccessToken(refreshToken);

    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    next(error);
  }
};

// Logout controller
export const logout = async (req, res, next) => {
  try {
    // 1. Read refresh token from cookie
    const refreshToken = req.cookies[AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME];

    // 2. Revoke the session
    await logoutUser(refreshToken);

    // 3. Clear refresh token cookie
    clearRefreshCookie(res);

    // 4. Return response
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: {
      user: req.user,
    },
  });
};
