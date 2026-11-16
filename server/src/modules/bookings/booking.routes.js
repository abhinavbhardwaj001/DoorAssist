import { Router } from "express";
import {
  createBookingController,
  getMyBookingsController,
  getProviderBookingsController,
  getBookingByIdController,
  acceptBookingController,
  rejectBookingController,
  startBookingController,
  completeBookingController,
  cancelBookingController,
} from "./booking.controller.js";
import { authenticate, authorizeRoles } from "../auth/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("customer"),
  createBookingController,
);
router.get(
  "/my-bookings",
  authenticate,
  authorizeRoles("customer"),
  getMyBookingsController,
);
router.get(
  "/provider-bookings",
  authenticate,
  authorizeRoles("provider"),
  getProviderBookingsController,
);
router.get(
  "/:bookingId",
  authenticate,
  authorizeRoles("customer", "provider"),
  getBookingByIdController,
);
router.patch(
  "/:bookingId/accept",
  authenticate,
  authorizeRoles("provider"),
  acceptBookingController,
);
router.patch(
  "/:bookingId/reject",
  authenticate,
  authorizeRoles("provider"),
  rejectBookingController,
);
router.patch(
  "/:bookingId/start",
  authenticate,
  authorizeRoles("provider"),
  startBookingController,
);
router.patch(
  "/:bookingId/complete",
  authenticate,
  authorizeRoles("provider"),
  completeBookingController,
);
router.patch(
  "/:bookingId/cancel",
  authenticate,
  authorizeRoles("customer"),
  cancelBookingController,
);

export default router;
