import { Router } from "express";
import {
  getActiveCategoriesController,
  createCategoryController,
  updateCategoryController,
  updateCategoryStatusController,
  getAllCategoriesAdminController,
} from "./category.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getActiveCategoriesController);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  uploadImage("image"),
  createCategoryController,
);
router.patch(
  "/:categoryId",
  authenticate,
  authorizeRoles("admin"),
  uploadImage("image"),
  updateCategoryController,
);
router.patch(
  "/:categoryId/status",
  authenticate,
  authorizeRoles("admin"),
  updateCategoryStatusController,
);
router.get(
  "/admin/all",
  authenticate,
  authorizeRoles("admin"),
  getAllCategoriesAdminController,
);

export default router;
