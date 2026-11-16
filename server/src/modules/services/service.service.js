import Service from "./service.model.js";
import ProviderProfile from "../providers/providerProfile.model.js";
import Category from "../categories/category.model.js";
import uploadImageToCloudinary from "../../utils/upload-image.js";
import cloudinary from "../../config/cloudinary.js";
import { pricingFieldsSchema } from "./service.validation.js";
import { validateServiceId } from "../../utils/validation.js";

export const getActiveServices = async ({
  search,
  categoryId,
  city,
  page = 1,
  limit = 10,
}) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * pageSize;

  const filter = {
    isActive: true,
  };

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  const providerFilter = {
    verificationStatus: "approved",
    ...(city
      ? {
          "serviceAreas.city": {
            $regex: `^${city}$`,
            $options: "i",
          },
        }
      : {}),
  };

  const matchingServices = await Service.find(filter)
    .populate({
      path: "categoryId",
      match: { isActive: true },
      select: "name slug image",
    })
    .populate({
      path: "providerId",
      match: providerFilter,
      select:
        "businessName profileImage experienceYears verificationStatus serviceAreas userId",
      populate: {
        path: "userId",
        match: { status: "active" },
        select: "name",
      },
    })
    .sort({ createdAt: -1 });

  const visibleServices = matchingServices.filter(
    (service) => service.providerId?.userId && service.categoryId,
  );

  const total = visibleServices.length;
  const services = visibleServices.slice(skip, skip + pageSize);

  return {
    services,
    pagination: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getServiceById = async (serviceId) => {
  validateServiceId(serviceId);

  const service = await Service.findOne({
    _id: serviceId,
    isActive: true,
  })
    .populate({
      path: "categoryId",
      select: "name slug image",
    })
    .populate({
      path: "providerId",
      match: { verificationStatus: "approved" },
      select: "businessName experienceYears serviceAreas userId",
      populate: {
        path: "userId",
        match: { status: "active" },
        select: "name",
      },
    });

  if (!service || !service.providerId || !service.providerId.userId) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

export const createProviderService = async (userId, serviceData) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (provider.verificationStatus !== "approved") {
    const error = new Error("Your provider account has not been approved");
    error.statusCode = 403;
    throw error;
  }

  const category = await Category.findOne({
    _id: serviceData.categoryId,
    isActive: true,
  });

  if (!category) {
    const error = new Error("Active category not found");
    error.statusCode = 400;
    throw error;
  }

  let image = "";
  let imagePublicId = "";

  if (serviceData.imageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      serviceData.imageFile.buffer,
      "doorassist/services",
    );

    image = uploadedImage.imageUrl;
    imagePublicId = uploadedImage.publicId;
  }

  try {
    return await Service.create({
      providerId: provider._id,
      categoryId: serviceData.categoryId,
      name: serviceData.name,
      description: serviceData.description,
      pricingType: serviceData.pricingType,
      price: serviceData.price,
      durationMinutes: serviceData.durationMinutes,
      image,
      imagePublicId,
    });
  } catch (error) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up new service image:", cleanupError);
      }
    }

    throw error;
  }
};

export const updateProviderService = async (userId, serviceId, updateData) => {
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

  const service = await Service.findOne({
    _id: serviceId,
    providerId: provider._id,
  });

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.categoryId !== undefined) {
    const category = await Category.findOne({
      _id: updateData.categoryId,
      isActive: true,
    });

    if (!category) {
      const error = new Error("Active category not found");
      error.statusCode = 400;
      throw error;
    }

    service.categoryId = category._id;
  }

  if (updateData.name !== undefined) {
    service.name = updateData.name;
  }

  if (updateData.description !== undefined) {
    service.description = updateData.description;
  }

  if (updateData.pricingType !== undefined) {
    service.pricingType = updateData.pricingType;
  }

  if (updateData.price !== undefined) {
    service.price = updateData.price;
  }

  if (updateData.durationMinutes !== undefined) {
    service.durationMinutes = updateData.durationMinutes;
  }

  // Validate the final pricing combination.
  const finalPricing = {
    pricingType: service.pricingType,
    price: service.pricingType === "on_request" ? undefined : service.price,
  };

  pricingFieldsSchema.parse(finalPricing);
  service.price = finalPricing.price;

  let oldPublicId;
  let newPublicId;

  if (updateData.imageFile) {
    const uploadedImage = await uploadImageToCloudinary(
      updateData.imageFile.buffer,
      "doorassist/services",
    );

    oldPublicId = service.imagePublicId;

    service.image = uploadedImage.imageUrl;
    service.imagePublicId = uploadedImage.publicId;
    newPublicId = uploadedImage.publicId;
  }

  try {
    await service.save();
  } catch (error) {
    // Remove the newly uploaded image if saving fails.
    if (newPublicId) {
      try {
        await cloudinary.uploader.destroy(newPublicId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded service image:",
          cleanupError,
        );
      }
    }

    throw error;
  }

  // Delete the previous image only after saving succeeds.
  if (oldPublicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
      console.error("Failed to delete old service image:", error);
    }
  }

  return service;
};

export const updateProviderServiceStatus = async (
  userId,
  serviceId,
  isActive,
) => {
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

  const service = await Service.findOne({
    _id: serviceId,
    providerId: provider._id,
  });

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  service.isActive = isActive;
  await service.save();

  return service;
};

export const getMyProviderServices = async (userId) => {
  const provider = await ProviderProfile.findOne({ userId });

  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }

  return Service.find({ providerId: provider._id })
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 });
};
