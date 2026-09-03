import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
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
  ];

  const shouldSkipToken = authRoutes.some((route) =>
    config.url?.startsWith(route)
  );

 if (token && !shouldSkipToken) {


  config.headers.Authorization = `Bearer ${token}`;
}


return config;
});
export default api;





api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw error;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        if (localStorage.getItem("refreshToken")) {
          localStorage.setItem(
            "accessToken",
            newAccessToken
          );
        } else {
          sessionStorage.setItem(
            "accessToken",
            newAccessToken
          );
        }

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);