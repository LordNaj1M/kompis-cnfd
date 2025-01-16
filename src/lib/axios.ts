import axios from "axios";

export const API_URL = import.meta.env.VITE_APP_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Menambahkan interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
