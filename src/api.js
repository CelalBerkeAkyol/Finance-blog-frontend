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
    console.log("Error from api", error);
    const errMessage =
      error.response.data.message ||
      "Beklenmedik bir hata oluştu. ( hata messajı bulunamadı )";
    const errCode = error.response?.data?.error?.code || "Error code not found";

    // Global logging - sadece geliştirme ortamında
    //Burada dönen hatalar sadece api hatalarını yakalamaya yarar
    if (!import.meta.env.PROD) {
      logError(
        "API",
        `[${error.response?.status}]  ${error.config.method.toUpperCase()} ${
          error.config.url
        } --> ${error.response?.data?.error?.code} -->`,
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
