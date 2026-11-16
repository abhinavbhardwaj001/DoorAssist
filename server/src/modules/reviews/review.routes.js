import { Router } from "express";
import {
  createReviewController,
  getProviderReviewsController,
} from "./review.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("customer"),
  createReviewController,
);
router.get("/provider/:providerId", getProviderReviewsController);

export default router;
