import User from "./user.model.js";
import ProviderProfile from "../providers/providerProfile.model.js";
import Service from "../services/service.model.js";
import Booking from "../bookings/booking.model.js";
import Review from "../reviews/review.model.js";
import Session from "../auth/session.model.js";

export const getCustomerDashboardStats = async (userId) => {
  const [
    totalBookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
  ] = await Promise.all([
    Booking.countDocuments({ customerId: userId }),
    Booking.countDocuments({ customerId: userId, status: "pending" }),
    Booking.countDocuments({ customerId: userId, status: "accepted" }),
    Booking.countDocuments({ customerId: userId, status: "completed" }),
    Booking.countDocuments({ customerId: userId, status: "cancelled" }),
    Review.countDocuments({ customerId: userId }),
  ]);

  return {
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      accepted: acceptedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
    reviews: {
      total: totalReviews,
    },
  };
};

export const getAdminDashboardStats = async () => {
  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    blockedUsers,
    totalProviders,
    pendingProviders,
    approvedProviders,
    totalServices,
    activeServices,
    totalBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "suspended" }),
    User.countDocuments({ status: "blocked" }),
    ProviderProfile.countDocuments(),
    ProviderProfile.countDocuments({ verificationStatus: "pending" }),
    ProviderProfile.countDocuments({ verificationStatus: "approved" }),
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "completed" }),
    Booking.countDocuments({ status: "cancelled" }),
    Review.countDocuments(),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      blocked: blockedUsers,
    },
    providers: {
      total: totalProviders,
      pending: pendingProviders,
      approved: approvedProviders,
    },
    services: {
      total: totalServices,
      active: activeServices,
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
    reviews: {
      total: totalReviews,
    },
  };
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  role,
  status,
  search,
} = {}) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

  const filter = {};

  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      currentPage,
      pageSize,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
    },
  };
};

export const updateUserStatus = async (userId, status, adminId) => {
  const allowedStatuses = ["active", "suspended", "blocked"];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid account status");
    error.statusCode = 400;
    throw error;
  }

  if (userId === adminId.toString()) {
    const error = new Error("You cannot change your own account status");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "admin") {
    const error = new Error("You cannot change another admin's status");
    error.statusCode = 403;
    throw error;
  }

  user.status = status;
  await user.save();

  if (status !== "active") {
    await Session.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: { revokedAt: new Date() },
      },
    );
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};
