import api from "./api";

export const getAdminDashboardStats = () => {
  return api.get("/users/admin-dashboard");
};

export const getAllUsers = (params = {}) => {
  return api.get("/users", { params });
};

export const updateUserStatus = (userId, status) => {
  return api.patch(`/users/${userId}/status`, { status });
};

export const getProviderApplications = (params = {}) => {
  return api.get("/providers/admin/applications", { params });
};

export const approveProviderApplication = (providerId) => {
  return api.patch(`/providers/${providerId}/approve`);
};

export const rejectProviderApplication = (providerId, rejectionReason) => {
  return api.patch(`/providers/${providerId}/reject`, {
    rejectionReason,
  });
};

export const getAllCategoriesAdmin = () => {
  return api.get("/categories/admin/all");
};

export const createAdminCategory = (formData) => {
  return api.post("/categories", formData);
};

export const updateAdminCategory = (categoryId, formData) => {
  return api.patch(`/categories/${categoryId}`, formData);
};

export const updateAdminCategoryStatus = (categoryId, isActive) => {
  return api.patch(`/categories/${categoryId}/status`, { isActive });
};
