import {
  createServiceSchema,
  updateServiceSchema,
  updateServiceStatusSchema,
} from "./service.validation.js";
import {
  getActiveServices,
  getServiceById,
  createProviderService,
  updateProviderService,
  updateProviderServiceStatus,
  getMyProviderServices
} from "./service.service.js";

export const getServices = async (req, res, next) => {
  try {
    const { search, categoryId, city, page, limit } = req.query;

    const result = await getActiveServices({
      search,
      categoryId,
      city,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: {
        count: result.services.length,
        services: result.services,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceByIdController = async (req, res, next) => {
  try {
    const service = await getServiceById(req.params.serviceId);

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = createServiceSchema.parse(req.body);

    // Get logged-in user's ID from authentication middleware
    const userId = req.user.id;

    // Create service
    const service = await createProviderService(userId, {
      ...validatedData,
      imageFile: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderServiceController = async (req, res, next) => {
  try {
    const validatedData = updateServiceSchema.parse(req.body);

    const service = await updateProviderService(
      req.user.id,
      req.params.serviceId,
      {
        ...validatedData,
        imageFile: req.file,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProviderServiceStatusController = async (req, res, next) => {
  try {
    const validatedData = updateServiceStatusSchema.parse(req.body);

    const service = await updateProviderServiceStatus(
      req.user.id,
      req.params.serviceId,
      validatedData.isActive,
    );

    return res.status(200).json({
      success: true,
      message: `Service ${
        service.isActive ? "activated" : "deactivated"
      } successfully`,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProviderServicesController = async (req, res, next) => {
  try {
    const services = await getMyProviderServices(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Your services fetched successfully",
      data: {
        count: services.length,
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};
