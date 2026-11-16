import { Router } from "express";
import {
  getCustomerDashboardStatsController,
  getAdminDashboard,
  getAllUsersController,
  updateUserStatusController,
} from "./user.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";

const router = Router();

router.get(
  "/customer-dashboard",
  authenticate,
  authorizeRoles("customer"),
  getCustomerDashboardStatsController,
);
router.get(
  "/admin-dashboard",
  authenticate,
  authorizeRoles("admin"),
  getAdminDashboard,
);
router.get("/", authenticate, authorizeRoles("admin"), getAllUsersController);
router.patch(
  "/:userId/status",
  authenticate,
  authorizeRoles("admin"),
  updateUserStatusController,
);

export default router;
