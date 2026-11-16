import {
  getMyPayments,
  getPaymentByBooking,
  initiatePayment,
  simulatePayment,
} from "./payment.service.js";
import { simulatePaymentSchema } from "./payment.validation.js";

export const getMyPaymentsController = async (req, res, next) => {
  try {
    const payments = await getMyPayments(req.user.id);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: { payments },
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByBookingController = async (req, res, next) => {
  try {
    const payment = await getPaymentByBooking(
      req.user.id,
      req.params.bookingId,
    );

    return res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

export const initiatePaymentController = async (req, res, next) => {
  try {
    const payment = await initiatePayment(req.user.id, req.params.bookingId);

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

export const simulatePaymentController = async (req, res, next) => {
  try {
    const { outcome } = simulatePaymentSchema.parse(req.body);

    const result = await simulatePayment(
      req.user.id,
      req.params.bookingId,
      outcome,
    );

    return res.status(200).json({
      success: true,
      message:
        outcome === "success"
          ? "Simulated payment successful"
          : "Simulated payment failed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
