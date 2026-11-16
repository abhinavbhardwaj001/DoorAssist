import {
  getAllUsersQuerySchema,
  updateUserStatusSchema,
} from "./user.validation.js";
import {
  getCustomerDashboardStats,
  getAdminDashboardStats,
  getAllUsers,
  updateUserStatus,
} from "./user.service.js";

export const getCustomerDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await getCustomerDashboardStats(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Customer dashboard statistics fetched successfully",
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardStats();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",
      data: {
        user: req.user,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const validation = getAllUsersQuerySchema.parse(req.query);

    const result = await getAllUsers(validation);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (req, res, next) => {
  try {
    const { status } = updateUserStatusSchema.parse(req.body);

    const user = await updateUserStatus(req.params.userId, status, req.user.id);

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
