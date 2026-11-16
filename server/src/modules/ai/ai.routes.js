import { Router } from "express";
import { diagnoseHomeIssue, generateServiceCopy } from "./ai.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";
import { aiRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/diagnose", aiRateLimiter, diagnoseHomeIssue);
router.post(
  "/generate-service-copy",
  authenticate,
  authorizeRoles("provider"),
  aiRateLimiter,
  generateServiceCopy,
);

export default router;
