import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Prevent multiple simultaneous refresh requests
let refreshPromise = null;

const getAuthStorage = () => {
  if (localStorage.getItem("refreshToken")) {
    return localStorage;
  }

  if (sessionStorage.getItem("refreshToken")) {
    return sessionStorage;
  }

  return null;
};

const clearAuthData = () => {
  const keys = ["accessToken", "refreshToken", "user"];

  keys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const authRoutes = [
    "/auth/login/",
    "/auth/signup/",
    "/auth/google-login/",
    "/auth/google-signup/",
    "/auth/forgot-password/",
    "/auth/reset-password/",
    "/auth/token/refresh/",
  ];

  const shouldSkipToken = authRoutes.some((route) =>
    config.url?.startsWith(route)
  );

  if (token && !shouldSkipToken) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes(
      "/auth/token/refresh/"
    );

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const storage = getAuthStorage();

          if (!storage) {
            throw new Error("Refresh token not found.");
          }

          const refreshToken = storage.getItem("refreshToken");

          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          if (!newAccessToken || !newRefreshToken) {
            throw new Error("Invalid token refresh response.");
          }

          // Save both rotated tokens in the same storage
          storage.setItem("accessToken", newAccessToken);
          storage.setItem("refreshToken", newRefreshToken);

          return newAccessToken;
        })()
          .catch((refreshError) => {
            clearAuthData();
            redirectToLogin();

            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

// LOGOUT
export const logout = () => {
  clearAuthData();
  redirectToLogin();
};

export default api;