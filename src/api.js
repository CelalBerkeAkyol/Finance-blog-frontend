// src/api.js
import axios from "axios";
import { logError, logSuccess } from "./utils/logger";

// Ortam değişkenlerinden API URL'sini al
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/blog";

const instance = axios.create({
  baseURL: API_URL, // Ortam değişkeninden alınan URL
  withCredentials: true, // Cookie gönderimi için gerekli
});

// Response interceptor - merkezi hata yönetimi ve başarılı cevapları loglama
instance.interceptors.response.use(
  (response) => {
    // API başarılı bir yanıt döndürdüğünde logla (sadece geliştirme ortamında)
    if (!import.meta.env.PROD) {
      logSuccess(
        "API Response",
        `[${response.status}] ${response.config.method.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response; // Cevabı döndür
  },
  (error) => {
    const errMessage =
      error.response?.data?.message ||
      "Beklenmedik bir hata oluştu. (hata mesajı bulunamadı)";
    const errCode = error.response?.data?.error?.code || "Error code not found";

    // Global logging - sadece geliştirme ortamında
    if (!import.meta.env.PROD) {
      logError(
        "API",
        `[${error.response?.status}]  ${error.config.method.toUpperCase()} ${
          error.config.url
        } --> ${errCode} -->`,
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
