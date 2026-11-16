import api from "./api";

export const getProviderById = (providerId) => {
  return api.get(`/providers/${providerId}`);
};

export const applyAsProvider = (formData) => {
  return api.post("/providers/apply", formData);
};

export const getProviderDashboardStats = () => {
  return api.get("/providers/me/dashboard");
};

export const getMyProviderProfile = () => {
  return api.get("/providers/me");
};

export const updateProviderAvailability = (availability) => {
  return api.patch("/providers/me/availability", {
    availability,
  });
};

export const updateMyProviderProfile = (formData) => {
  return api.patch("/providers/me", formData);
};

export const getMyProviderApplication = () => {
  return api.get("/providers/my-application");
};
