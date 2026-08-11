import axios from "axios";
import { API_BASE_URL } from "@/config/constants";

export { API_BASE_URL };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token") || localStorage.getItem("lynkr_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("lynkr_token");
      localStorage.removeItem("lynkr.user");
    }
    return Promise.reject(error);
  }
);
