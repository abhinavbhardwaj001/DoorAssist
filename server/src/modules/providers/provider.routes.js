import { Router } from "express";
import {
  applyAsProvider,
  getProviderApplicationsController,
  approveProvider,
  rejectProvider,
  getMyProviderProfileController,
  getProviderByIdController,
  updateProviderProfileController,
  updateProviderAvailabilityController,
  getProviderDashboardStatsController,
  getMyProviderApplicationController
} from "./provider.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/apply",
  authenticate,
  authorizeRoles("customer"),
  uploadImage("profileImage"),
  applyAsProvider,
);
router.get(
  "/admin/applications",
  authenticate,
  authorizeRoles("admin"),
  getProviderApplicationsController,
);
router.get(
  "/my-application",
  authenticate,
  authorizeRoles("customer", "provider"),
  getMyProviderApplicationController,
);
router.patch(
  "/:providerId/approve",
  authenticate,
  authorizeRoles("admin"),
  approveProvider,
);
router.patch(
  "/:providerId/reject",
  authenticate,
  authorizeRoles("admin"),
  rejectProvider,
);
router.get(
  "/me",
  authenticate,
  authorizeRoles("provider"),
  getMyProviderProfileController,
);
router.get("/:providerId", getProviderByIdController);
router.patch(
  "/me",
  authenticate,
  authorizeRoles("provider"),
  uploadImage("profileImage"),
  updateProviderProfileController,
);
router.patch(
  "/me/availability",
  authenticate,
  authorizeRoles("provider"),
  updateProviderAvailabilityController,
);
router.get(
  "/me/dashboard",
  authenticate,
  authorizeRoles("provider"),
  getProviderDashboardStatsController,
);

export default router;
