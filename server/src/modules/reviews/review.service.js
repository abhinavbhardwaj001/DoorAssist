import mongoose from "mongoose";
import Review from "./review.model.js";
import Booking from "../bookings/booking.model.js";
import { validateProviderId } from "../../utils/validation.js";

export const createReview = async (customerId, reviewData) => {
  const booking = await Booking.findOne({
    _id: reviewData.bookingId,
    customerId,
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "completed") {
    const error = new Error(
      "You can review a booking only after it is completed",
    );
    error.statusCode = 400;
    throw error;
  }

  const existingReview = await Review.findOne({
    bookingId: booking._id,
  });

  if (existingReview) {
    const error = new Error("You have already reviewed this booking");
    error.statusCode = 409;
    throw error;
  }

  try {
    const review = await Review.create({
      bookingId: booking._id,
      customerId,
      providerId: booking.providerId,
      rating: reviewData.rating,
      comment: reviewData.comment ?? "",
    });

    return review;
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error(
        "You have already reviewed this booking",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};

export const getProviderReviews = async (
  providerId,
  { page = 1, limit = 5 } = {},
) => {
  validateProviderId(providerId);

  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(20, Math.max(1, Number(limit) || 5));
  const skip = (currentPage - 1) * pageSize;

  const [reviews, stats] = await Promise.all([
    Review.find({ providerId })
      .populate("customerId", "name")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    Review.aggregate([
      { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
  ]);

  const averageRating = stats[0]?.averageRating ?? 0;
  const totalReviews = stats[0]?.totalReviews ?? 0;

  return {
    reviews,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
    pagination: {
      currentPage,
      pageSize,
      totalPages: Math.ceil(totalReviews / pageSize),
      hasMore: skip + reviews.length < totalReviews,
    },
  };
};
