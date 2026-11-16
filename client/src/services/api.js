import axios from "axios";

import {
  getAccessToken,
  setAccessToken,
  notifySessionExpired,
} from "./tokenStore";

const baseURL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 45000,
});

const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 45000,
});

let refreshPromise = null;

// Shared refresh function
export const requestTokenRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/auth/refresh")
      .then((response) => {
        setAccessToken(response.data.data.accessToken);
        return response;
      })
      .catch((error) => {
        notifySessionExpired();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Attach access token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh and retry requests after 401
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const skipRefreshEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-email",
      "/auth/resend-verification",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/refresh",
      "/auth/logout",
    ];

    const shouldSkipRefresh = skipRefreshEndpoints.includes(
      originalRequest.url?.split("?")[0],
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await requestTokenRefresh();
      const newToken = response.data.data.accessToken;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default api;
