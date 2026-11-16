import { Router } from "express";
import {
  register,
  verifyEmail,
  resendVerification,
  forgotPasswordController,
  resetPasswordController,
  login,
  refresh,
  logout,
  getCurrentUser,
} from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);
router.post("/forgot-password", authLimiter, forgotPasswordController);
router.post("/reset-password", authLimiter, resetPasswordController);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

export default router;
