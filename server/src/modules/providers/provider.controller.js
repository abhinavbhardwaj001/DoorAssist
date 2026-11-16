import {
  providerApplicationSchema,
  providerIdSchema,
  rejectProviderApplicationSchema,
  updateProviderProfileSchema,
  updateAvailabilitySchema,
} from "./provider.validation.js";
import {
  createProviderApplication,
  getProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
  getMyProviderProfile,
  getProviderById,
  updateProviderProfile,
  updateProviderAvailability,
  getProviderDashboardStats,
  getMyProviderApplication,
} from "./provider.service.js";

export const applyAsProvider = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = providerApplicationSchema.parse(req.body);

    // 2. Get authenticated user's ID
    const userId = req.user.id;

    // 3. Pass the optional image file to the service
    const providerProfile = await createProviderApplication(userId, {
      ...validatedData,
      profileImageFile: req.file,
    });

    // 4. Send response
    return res.status(201).json({
      success: true,
      message: "Provider application submitted successfully",
      data: {
        provider: providerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderApplicationsController = async (req, res, next) => {
  try {
    const result = await getProviderApplications({
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      message: "Provider applications fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProvider = async (req, res, next) => {
  try {
    const providerId = providerIdSchema.parse(req.params.providerId);

    const provider = await approveProviderApplication(providerId);

    return res.status(200).json({
      success: true,
      message: "Provider application approved successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProvider = async (req, res, next) => {
  try {
    const providerId = providerIdSchema.parse(req.params.providerId);

    const { rejectionReason } = rejectProviderApplicationSchema.parse(req.body);

    const provider = await rejectProviderApplication(
      providerId,
      rejectionReason,
    );

    return res.status(200).json({
      success: true,
      message: "Provider application rejected successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProviderProfileController = async (req, res, next) => {
  try {
    const provider = await getMyProviderProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Provider profile fetched successfully",
      data: {
        provider,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderByIdController = async (req, res, next) => {
  try {
    const provider = await getProviderById(req.params.providerId);

    res.status(200).json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderProfileController = async (req, res, next) => {
  try {
    const validatedData = updateProviderProfileSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field or an image to update",
      });
    }

    const provider = await updateProviderProfile(req.user.id, {
      ...validatedData,
      profileImageFile: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderAvailabilityController = async (req, res, next) => {
  try {
    const { availability } = updateAvailabilitySchema.parse(req.body);

    const provider = await updateProviderAvailability(
      req.user.id,
      availability,
    );

    return res.status(200).json({
      success: true,
      message: "Provider availability updated successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getProviderDashboardStats(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Provider dashboard statistics fetched successfully",
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProviderApplicationController = async (req, res, next) => {
  try {
    const provider = await getMyProviderApplication(req.user.id);

    return res.status(200).json({
      success: true,
      message: provider
        ? "Provider application fetched successfully"
        : "No provider application found",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};
