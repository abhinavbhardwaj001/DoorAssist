import ProviderProfile from "./providerProfile.model.js";
import User from "../users/user.model.js";
import Service from "../services/service.model.js";
import Booking from "../bookings/booking.model.js";
import Review from "../reviews/review.model.js";
import uploadImageToCloudinary from "../../utils/upload-image.js";
import cloudinary from "../../config/cloudinary.js";
import { validateProviderId } from "../../utils/validation.js";

export const createProviderApplication = async (userId, providerData) => {
  const existingProfile = await ProviderProfile.findOne({ userId });

  if (existingProfile) {
    const error = new Error("Provider application already exists");
    error.statusCode = 409;
    throw error;
  }

  let profileImage = "";
  let profileImagePublicId = "";

  if (providerData.profileImageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      providerData.profileImageFile.buffer,
      "doorassist/providers",
    );

    profileImage = uploadedImage.imageUrl;
    profileImagePublicId = uploadedImage.publicId;
  }

  try {
    return await ProviderProfile.create({
      userId,
      businessName: providerData.businessName,
      description: providerData.description,
      experienceYears: providerData.experienceYears,
      serviceAreas: providerData.serviceAreas,
      profileImage,
      profileImagePublicId,
      verificationStatus: "pending",
    });
  } catch (error) {
    if (profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(profileImagePublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up provider image:", cleanupError);
      }
    }

    throw error;
  }
};

export const getProviderApplications = async ({
  page = 1,
  limit = 10,
  status,
  search,
} = {}) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

  const filter = {};

  if (status) {
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      const error = new Error("Invalid verification status");
      error.statusCode = 400;
      throw error;
    }

    filter.verificationStatus = status;
  }

  const query = String(search || "").trim();

  if (query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: escapedQuery, $options: "i" } },
        { email: { $regex: escapedQuery, $options: "i" } },
      ],
    }).select("_id");

    filter.$or = [
      { businessName: { $regex: escapedQuery, $options: "i" } },
      { userId: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  const [providers, totalProviders] = await Promise.all([
    ProviderProfile.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean(),

    ProviderProfile.countDocuments(filter),
  ]);

  return {
    providers,
    pagination: {
      currentPage,
      pageSize,
      totalProviders,
      totalPages: Math.ceil(totalProviders / pageSize),
    },
  };
};

export const approveProviderApplication = async (providerId) => {
  const provider = await ProviderProfile.findOneAndUpdate(
    {
      _id: providerId,
      verificationStatus: "pending",
    },
    {
      $set: { verificationStatus: "approved" },
      $unset: { rejectionReason: 1 },
    },
    { returnDocument: "after", runValidators: true },
  );

  if (!provider) {
    const existingProvider = await ProviderProfile.exists({
      _id: providerId,
    });

    const error = new Error(
      existingProvider
        ? "Provider application has already been processed"
        : "Provider application not found",
    );

    error.statusCode = existingProvider ? 400 : 404;
    throw error;
  }

  const user = await User.findById(provider.userId);

  if (!user) {
    const error = new Error("Provider user account not found");
    error.statusCode = 404;
    throw error;
  }

  user.role = "provider";
  await user.save();

  return provider;
};

export const rejectProviderApplication = async (
  providerId,
  rejectionReason,
) => {
  const provider = await ProviderProfile.findById(providerId);

  if (!provider) {
    const error = new Error("Provider application not found");
    error.statusCode = 404;
    throw error;
  }

  if (provider.verificationStatus !== "pending") {
    const error = new Error("Provider application has already been processed");
    error.statusCode = 400;
    throw error;
  }

  provider.verificationStatus = "rejected";
  provider.rejectionReason = rejectionReason;

  await provider.save();

  return provider;
};

export const getMyProviderProfile = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId }).populate(
    "userId",
    "name email phone",
  );

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  return provider;
};

export const getProviderById = async (providerId) => {
  validateProviderId(providerId);

  const provider = await ProviderProfile.findOne({
    _id: providerId,
    verificationStatus: "approved",
  })
    .select(
      "businessName description profileImage experienceYears serviceAreas userId",
    )
    .populate({
      path: "userId",
      match: { status: "active" },
      select: "name",
    });

  if (!provider || !provider.userId) {
    throw new Error("Provider not found");
  }

  return provider;
};

export const updateProviderProfile = async (userId, updateData) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.businessName !== undefined) {
    provider.businessName = updateData.businessName;
  }

  if (updateData.description !== undefined) {
    provider.description = updateData.description;
  }

  if (updateData.experienceYears !== undefined) {
    provider.experienceYears = updateData.experienceYears;
  }

  if (updateData.serviceAreas !== undefined) {
    provider.serviceAreas = updateData.serviceAreas;
  }

  let oldPublicId = null;
  let newPublicId = null;

  if (updateData.profileImageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      updateData.profileImageFile.buffer,
      "doorassist/providers",
    );

    oldPublicId = provider.profileImagePublicId;
    newPublicId = uploadedImage.publicId;

    provider.profileImage = uploadedImage.imageUrl;
    provider.profileImagePublicId = newPublicId;
  }

  try {
    await provider.save();
  } catch (error) {
    if (newPublicId) {
      try {
        await cloudinary.uploader.destroy(newPublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up new provider image:", cleanupError);
      }
    }

    throw error;
  }

  if (oldPublicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old provider image:", error);
    }
  }

  return provider;
};

export const updateProviderAvailability = async (userId, availability) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (provider.verificationStatus !== "approved") {
    const error = new Error("Your provider profile is not approved");
    error.statusCode = 403;
    throw error;
  }

  provider.availability = availability;

  await provider.save();

  return provider;
};

export const getProviderDashboardStats = async (userId) => {
  const providerProfile = await ProviderProfile.findOne({ userId });

  if (!providerProfile) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  const providerId = providerProfile._id;

  const [
    totalServices,
    activeServices,
    totalBookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    cancelledBookings,
    reviewStats,
  ] = await Promise.all([
    Service.countDocuments({ providerId }),
    Service.countDocuments({ providerId, isActive: true }),
    Booking.countDocuments({ providerId }),
    Booking.countDocuments({ providerId, status: "pending" }),
    Booking.countDocuments({ providerId, status: "accepted" }),
    Booking.countDocuments({ providerId, status: "completed" }),
    Booking.countDocuments({ providerId, status: "cancelled" }),
    Review.aggregate([
      { $match: { providerId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    services: {
      total: totalServices,
      active: activeServices,
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      accepted: acceptedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
    reviews: {
      averageRating: Number((reviewStats[0]?.averageRating ?? 0).toFixed(1)),
      total: reviewStats[0]?.totalReviews ?? 0,
    },
  };
};

export const getMyProviderApplication = async (userId) => {
  return ProviderProfile.findOne({ userId }).select(
    "businessName description experienceYears serviceAreas profileImage verificationStatus rejectionReason createdAt updatedAt",
  );
};
