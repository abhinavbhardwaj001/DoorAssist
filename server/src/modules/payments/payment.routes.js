import { Router } from "express";
import {
  getMyPaymentsController,
  getPaymentByBookingController,
  initiatePaymentController,
  simulatePaymentController,
} from "./payment.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("customer"));
router.get("/", getMyPaymentsController);
router.get("/:bookingId", getPaymentByBookingController);
router.post("/:bookingId/initiate", initiatePaymentController);
router.post("/:bookingId/simulate", simulatePaymentController);

export default router;
