import api from "./api";

export const getCustomerDashboardStats = () => {
  return api.get("/users/customer-dashboard");
};
