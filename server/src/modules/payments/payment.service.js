import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Booking from "../bookings/booking.model.js";
import { validateBookingId } from "../../utils/validation.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getMyPayments = async (customerId) => {
  return Payment.find({ customerId })
    .populate("bookingId", "status scheduledAt")
    .sort({ createdAt: -1 });
};

export const getPaymentByBooking = async (customerId, bookingId) => {
  validateBookingId(bookingId);

  const payment = await Payment.findOne({
    bookingId,
    customerId,
  }).populate("bookingId", "status scheduledAt");

  if (!payment) {
    throw createError("Payment not found", 404);
  }

  return payment;
};

export const initiatePayment = async (customerId, bookingId) => {
  validateBookingId(bookingId);

  const booking = await Booking.findOne({
    _id: bookingId,
    customerId,
  });

  if (!booking) {
    throw createError("Booking not found", 404);
  }

  if (booking.paymentStatus === "success" || booking.status === "confirmed") {
    throw createError("This booking has already been paid", 409);
  }

  if (!["accepted", "payment_pending"].includes(booking.status)) {
    throw createError(
      "Payment can only be initiated for an accepted booking",
      400,
    );
  }

  if (
    typeof booking.price !== "number" ||
    !Number.isFinite(booking.price) ||
    booking.price <= 0
  ) {
    throw createError("A valid booking price is required", 400);
  }

  let payment = await Payment.findOne({ bookingId });

  if (payment?.status === "success") {
    throw createError("This booking has already been paid", 409);
  }

  if (payment?.status === "refunded") {
    throw createError(
      "A refunded payment cannot be retried through this flow",
      400,
    );
  }

  if (payment?.status === "pending") {
    return payment;
  }

  if (payment) {
    // Allow a failed payment to be retried.
    payment.amount = booking.price;
    payment.status = "pending";
    payment.paidAt = undefined;
    payment.set("transactionId", undefined);
    await payment.save();
  } else {
    payment = await Payment.create({
      bookingId: booking._id,
      customerId,
      amount: booking.price,
      currency: "INR",
      paymentMethod: "simulation",
      status: "pending",
    });
  }

  booking.paymentStatus = "pending";
  booking.status = "payment_pending";
  await booking.save();

  return payment;
};

export const simulatePayment = async (customerId, bookingId, outcome) => {
  validateBookingId(bookingId);

  if (!["success", "failed"].includes(outcome)) {
    throw createError("Invalid payment outcome", 400);
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    customerId,
    status: "payment_pending",
  });

  if (!booking) {
    throw createError("Booking not found or not awaiting payment", 404);
  }

  const payment = await Payment.findOne({
    bookingId,
    customerId,
    status: "pending",
  });

  if (!payment) {
    throw createError("Pending payment not found", 404);
  }

  // Only update a payment that is still pending.
  const paymentUpdate = {
    status: outcome,
    paidAt: outcome === "success" ? new Date() : undefined,
    transactionId:
      outcome === "success"
        ? `SIM-${new mongoose.Types.ObjectId().toString()}`
        : undefined,
  };

  const updatedPayment = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "pending",
    },
    { $set: paymentUpdate },
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedPayment) {
    throw createError("Payment has already been processed", 409);
  }

  try {
    // Only transition a booking that is still awaiting payment.
    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        customerId,
        status: "payment_pending",
        paymentStatus: "pending",
      },
      {
        $set: {
          paymentStatus: outcome,
          status: outcome === "success" ? "confirmed" : "accepted",
        },
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedBooking) {
      throw createError("Booking state changed while processing payment", 409);
    }

    return {
      payment: updatedPayment,
      booking: updatedBooking,
    };
  } catch (error) {
    // Best-effort compensation if the booking update fails.
    const rollback = await Payment.updateOne(
      {
        _id: updatedPayment._id,
        status: outcome,
      },
      {
        $set: { status: "pending" },
        $unset: { paidAt: "", transactionId: "" },
      },
    );

    if (rollback.modifiedCount === 0) {
      console.error(
        "Payment rollback could not be completed:",
        updatedPayment._id.toString(),
      );
    }

    throw error;
  }
};
