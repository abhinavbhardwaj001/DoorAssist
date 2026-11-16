import Booking from "./booking.model.js";
import Service from "../services/service.model.js";
import ProviderProfile from "../providers/providerProfile.model.js";
import Category from "../categories/category.model.js";
import User from "../users/user.model.js";
import { validateBookingId } from "../../utils/validation.js";

const hasBookingConflict = async ({
  providerId,
  scheduledAt,
  durationMinutes,
  excludeBookingId,
}) => {
  const scheduledStart = new Date(scheduledAt);

  const scheduledEnd = new Date(
    scheduledStart.getTime() + durationMinutes * 60_000,
  );

  const filter = {
    providerId,
    status: {
      $in: [
        "pending",
        "accepted",
        "payment_pending",
        "confirmed",
        "in_progress",
      ],
    },
    scheduledAt: { $lt: scheduledEnd },
  };

  if (excludeBookingId) {
    filter._id = { $ne: excludeBookingId };
  }

  const existingBookings = await Booking.find(filter).select(
    "scheduledAt durationMinutes",
  );

  return existingBookings.some((existingBooking) => {
    const existingStart = new Date(existingBooking.scheduledAt);

    const existingEnd = new Date(
      existingStart.getTime() + existingBooking.durationMinutes * 60_000,
    );

    return scheduledStart < existingEnd && existingStart < scheduledEnd;
  });
};

const isWithinProviderAvailability = (
  scheduledAt,
  durationMinutes,
  availability,
) => {
  // Convert the scheduled date to IST (UTC + 5 hours 30 minutes).
  const istDate = new Date(new Date(scheduledAt).getTime() + 330 * 60 * 1000);

  const dayOfWeek = istDate.getUTCDay();
  const startMinutes = istDate.getUTCHours() * 60 + istDate.getUTCMinutes();

  const endMinutes = startMinutes + durationMinutes;

  // Find the provider's working hours for this weekday.
  const workingHours = availability.find((day) => day.dayOfWeek === dayOfWeek);

  if (!workingHours) {
    return false;
  }

  const [startHour, startMinute] = workingHours.startTime
    .split(":")
    .map(Number);

  const [endHour, endMinute] = workingHours.endTime.split(":").map(Number);

  const availableStart = startHour * 60 + startMinute;
  const availableEnd = endHour * 60 + endMinute;

  // The entire service must fit within working hours.
  return startMinutes >= availableStart && endMinutes <= availableEnd;
};

export const createBooking = async (customerId, bookingData) => {
  // 1. Find the requested service
  const service = await Service.findOne({
    _id: bookingData.serviceId,
    isActive: true,
  });

  if (!service) {
    const error = new Error("Service not found or unavailable");
    error.statusCode = 404;
    throw error;
  }

  // Verify that the service category is still active
  const category = await Category.findOne({
    _id: service.categoryId,
    isActive: true,
  });

  if (!category) {
    const error = new Error("Service category is unavailable");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check that the provider is approved
  const provider = await ProviderProfile.findOne({
    _id: service.providerId,
    verificationStatus: "approved",
  });

  if (!provider) {
    const error = new Error("Service provider is not approved");
    error.statusCode = 403;
    throw error;
  }

  // 3. Check that the provider serves the requested city
  const servesCity = provider.serviceAreas.some(
    (area) =>
      area.city.toLowerCase() === bookingData.address.city.toLowerCase() &&
      area.state.toLowerCase() === bookingData.address.state.toLowerCase(),
  );

  if (!servesCity) {
    const error = new Error("This provider does not serve the selected city");
    error.statusCode = 400;
    throw error;
  }

  // 4. Determine the booking price on the server
  if (service.pricingType === "on_request" || service.price == null) {
    const error = new Error(
      "This service requires a price confirmation before booking",
    );
    error.statusCode = 400;
    throw error;
  }

  const isAvailable = isWithinProviderAvailability(
    bookingData.scheduledAt,
    service.durationMinutes,
    provider.availability,
  );

  if (!isAvailable) {
    const error = new Error(
      "This provider is not available at the requested date and time",
    );
    error.statusCode = 400;
    throw error;
  }

  // Prevent overlapping bookings for the same provider
  const hasConflict = await hasBookingConflict({
    providerId: provider._id,
    scheduledAt: bookingData.scheduledAt,
    durationMinutes: service.durationMinutes,
  });

  if (hasConflict) {
    const error = new Error(
      "This provider already has a booking during the selected time",
    );

    error.statusCode = 409;
    throw error;
  }

  // 5. Create the booking
  const booking = await Booking.create({
    customerId,
    providerId: provider._id,
    serviceId: service._id,

    scheduledAt: bookingData.scheduledAt,
    address: bookingData.address,
    customerNote: bookingData.customerNote,

    // Snapshot service details at booking time
    serviceName: service.name,
    price: service.price,
    durationMinutes: service.durationMinutes,

    status: "pending",
    paymentStatus: "not_required",
  });

  return booking;
};

export const getCustomerBookings = async (customerId) => {
  const bookings = await Booking.find({ customerId })
    .populate("serviceId", "name description pricingType")
    .populate({
      path: "providerId",
      select: "businessName userId",
      populate: {
        path: "userId",
        select: "name",
      },
    })
    .sort({ createdAt: -1 });

  return bookings;
};

export const getProviderBookings = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  const bookings = await Booking.find({
    providerId: provider._id,
  })
    .populate("serviceId", "name description pricingType")
    .populate("customerId", "name email phone")
    .sort({ createdAt: -1 });

  return bookings;
};

export const getBookingById = async (userId, role, bookingId) => {
  validateBookingId(bookingId);
  const query = {
    _id: bookingId,
  };

  if (role === "customer") {
    query.customerId = userId;
  }

  if (role === "provider") {
    const provider = await ProviderProfile.findOne({
      userId,
    });

    if (!provider) {
      const error = new Error("Provider profile not found");
      error.statusCode = 404;
      throw error;
    }

    query.providerId = provider._id;
  }

  const booking = await Booking.findOne(query)
    .populate("customerId", "name email phone")
    .populate("providerId", "businessName experienceYears")
    .populate("serviceId", "name description pricingType");

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  return booking;
};

export const acceptBooking = async (userId, bookingId) => {
  validateBookingId(bookingId);
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (provider.verificationStatus !== "approved") {
    const error = new Error("Your provider account is not approved");
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(userId).select("status");

  if (!user || user.status !== "active") {
    const error = new Error("Your user account is not active");
    error.statusCode = 403;
    throw error;
  }

  // Find a pending booking belonging to this provider.
  const existingBooking = await Booking.findOne({
    _id: bookingId,
    providerId: provider._id,
    status: "pending",
  });

  if (!existingBooking) {
    const booking = await Booking.findOne({
      _id: bookingId,
      providerId: provider._id,
    }).select("status");

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    const error = new Error("Only pending bookings can be accepted");
    error.statusCode = 400;
    throw error;
  }

  // Check for another active booking at the same time.
  const hasConflict = await hasBookingConflict({
    providerId: provider._id,
    scheduledAt: existingBooking.scheduledAt,
    durationMinutes: existingBooking.durationMinutes,
    excludeBookingId: existingBooking._id,
  });

  if (hasConflict) {
    const error = new Error(
      "Cannot accept this booking because it overlaps another active booking",
    );
    error.statusCode = 409;
    throw error;
  }

  // Atomically accept only if it is still pending.
  const acceptedBooking = await Booking.findOneAndUpdate(
    {
      _id: existingBooking._id,
      providerId: provider._id,
      status: "pending",
    },
    {
      $set: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!acceptedBooking) {
    const error = new Error(
      "This booking has already been updated. Please refresh and try again.",
    );
    error.statusCode = 409;
    throw error;
  }

  return acceptedBooking;
};

export const rejectBooking = async (userId, bookingId, rejectionReason) => {
  validateBookingId(bookingId);
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    providerId: provider._id,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "pending") {
    const error = new Error("Only pending bookings can be rejected");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "rejected";
  booking.rejectionReason = rejectionReason;

  await booking.save();

  return booking;
};

export const startBooking = async (userId, bookingId) => {
  validateBookingId(bookingId);
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    providerId: provider._id,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (!["accepted", "confirmed"].includes(booking.status)) {
    const error = new Error(
      "Only accepted or confirmed bookings can be started",
    );
    error.statusCode = 400;
    throw error;
  }
  booking.status = "in_progress";

  await booking.save();

  return booking;
};

export const completeBooking = async (userId, bookingId) => {
  validateBookingId(bookingId);
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    providerId: provider._id,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (!["accepted", "confirmed", "in_progress"].includes(booking.status)) {
    const error = new Error(
      "Only accepted or in-progress bookings can be completed",
    );
    error.statusCode = 400;
    throw error;
  }

  booking.status = "completed";
  booking.completedAt = new Date();

  await booking.save();

  return booking;
};

export const cancelBooking = async (
  customerId,
  bookingId,
  cancellationReason,
) => {
  validateBookingId(bookingId);
  const booking = await Booking.findOne({
    _id: bookingId,
    customerId,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (!["pending", "accepted"].includes(booking.status)) {
    const error = new Error(
      "Only pending or accepted bookings can be cancelled",
    );
    error.statusCode = 400;
    throw error;
  }

  booking.status = "cancelled";
  booking.cancellationReason = cancellationReason;
  booking.cancelledBy = customerId;
  booking.cancelledAt = new Date();

  await booking.save();

  return booking;
};
