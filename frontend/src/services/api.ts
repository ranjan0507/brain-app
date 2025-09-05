// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "" // or leave "" if using Vite proxy
});

// Add token automatically to requests
api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = new axios.AxiosHeaders();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler: if token expired/invalid, sign out
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
      } catch {}
      // Avoid infinite loops if already on signin
      if (!window.location.pathname.includes("/signin")) {
        window.location.replace("/signin");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
