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

export default api;
