// src/api.js
import axios from "axios";
import { logError } from "./utils/logger";

// Ortam değişkenlerinden API URL'sini al
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/blog";

const instance = axios.create({
  baseURL: API_URL, // Ortam değişkeninden alınan URL
  withCredentials: true, // Cookie gönderimi için gerekli
});

// Response interceptor - merkezi hata yönetimi
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errMessage =
      error.response?.data?.error?.details?.[0] ||
      error.response?.data?.message ||
      error.message ||
      "Beklenmedik bir hata oluştu.";
    const errCode = error.response?.data?.error?.code || "Error code not found";

    // Global logging - sadece geliştirme ortamında
    if (!import.meta.env.PROD) {
      logError(
        "API",
        `[${error.response?.status}] ${error.config.method.toUpperCase()} ${
          error.config.url
        }`,
        errMessage
      );
    }

    return Promise.reject({
      message: errMessage,
      code: errCode,
      status: error.response?.status,
    });
  }
);

export default instance;
