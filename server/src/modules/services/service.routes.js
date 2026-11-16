import { Router } from "express";
import {
  getServices,
  getServiceByIdController,
  createService,
  updateProviderServiceController,
  updateProviderServiceStatusController,
  getMyProviderServicesController
} from "./service.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getServices);
router.get(
  "/my-services",
  authenticate,
  authorizeRoles("provider"),
  getMyProviderServicesController,
);
router.get("/:serviceId", getServiceByIdController);
router.post(
  "/",
  authenticate,
  authorizeRoles("provider"),
  uploadImage("image"),
  createService,
);
router.patch(
  "/:serviceId",
  authenticate,
  authorizeRoles("provider"),
  uploadImage("image"),
  updateProviderServiceController,
);
router.patch(
  "/:serviceId/status",
  authenticate,
  authorizeRoles("provider"),
  updateProviderServiceStatusController,
);

export default router;
