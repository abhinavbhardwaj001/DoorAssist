import api, { requestTokenRefresh } from "./api";

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const verifyEmail = (data) => {
  return api.post("/auth/verify-email", data);
};

export const resendVerificationOtp = (data) => {
  return api.post("/auth/resend-verification", data);
};

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const refreshToken = () => {
  return requestTokenRefresh();
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};
