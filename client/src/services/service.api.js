import api from "./api";

export const getActiveServices = (params = {}) => {
  return api.get("/services", { params });
};

export const getServiceById = (serviceId) => {
  return api.get(`/services/${serviceId}`);
};

export const getMyProviderServices = () => {
  return api.get("/services/my-services");
};

export const updateServiceStatus = (serviceId, isActive) => {
  return api.patch(`/services/${serviceId}/status`, {
    isActive,
  });
};

export const createProviderService = (formData) => {
  return api.post("/services", formData);
};

export const updateProviderService = (serviceId, formData) => {
  return api.patch(`/services/${serviceId}`, formData);
};
