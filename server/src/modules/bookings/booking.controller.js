import {
  createBookingSchema,
  rejectBookingSchema,
  cancelBookingSchema,
} from "./booking.validation.js";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
  cancelBooking,
} from "./booking.service.js";

export const createBookingController = async (req, res, next) => {
  try {
    // 1. Validate the request body
    const validatedData = createBookingSchema.parse(req.body);

    // 2. Get the customer ID from the authenticated user
    const customerId = req.user.id;

    // 3. Create the booking
    const booking = await createBooking(customerId, validatedData);

    // 4. Return the response
    return res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookingsController = async (req, res, next) => {
  try {
    const bookings = await getCustomerBookings(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Your bookings fetched successfully",
      data: {
        count: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderBookingsController = async (req, res, next) => {
  try {
    const bookings = await getProviderBookings(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Provider bookings fetched successfully",
      data: {
        count: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingByIdController = async (req, res, next) => {
  try {
    const booking = await getBookingById(
      req.user.id,
      req.user.role,
      req.params.bookingId,
    );

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const acceptBookingController = async (req, res, next) => {
  try {
    const booking = await acceptBooking(req.user.id, req.params.bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectBookingController = async (req, res, next) => {
  try {
    const validatedData = rejectBookingSchema.parse(req.body);

    const booking = await rejectBooking(
      req.user.id,
      req.params.bookingId,
      validatedData.rejectionReason,
    );

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const startBookingController = async (req, res, next) => {
  try {
    const booking = await startBooking(req.user.id, req.params.bookingId);

    return res.status(200).json({
      success: true,
      message: "Service started successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const completeBookingController = async (req, res, next) => {
  try {
    const booking = await completeBooking(req.user.id, req.params.bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBookingController = async (req, res, next) => {
  try {
    const validatedData = cancelBookingSchema.parse(req.body);

    const booking = await cancelBooking(
      req.user.id,
      req.params.bookingId,
      validatedData.cancellationReason,
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};
