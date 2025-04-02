// src/api.js
import axios from "axios";
import { logApiResponse } from "./utils/logger";

// Ortam değişkenlerinden API URL'sini al
const API_URL = import.meta.env.VITE_API_URL;

// Hassas veri içeren alanların listesi (maskelenecek)
const SENSITIVE_FIELDS = [
  "token",
  "password",
  "email",
  "phone",
  "address",
  "creditCard",
  "cardNumber",
  "cvv",
  "secretKey",
  "apiKey",
];

/**
 * Veri içerisindeki hassas bilgileri maskeler
 * @param {any} data - İşlenecek veri
 * @returns {any} - Maskelenmiş veri
 */
const maskSensitiveData = (data) => {
  if (!data) return data;

  // Primitive değerler için kontrol
  if (typeof data !== "object") return data;

  // Array kontrolü
  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  // Object kontrolü
  const maskedData = { ...data };

  for (const key in maskedData) {
    // Anahtar hassas mı kontrol et
    if (
      SENSITIVE_FIELDS.some((field) =>
        key.toLowerCase().includes(field.toLowerCase())
      )
    ) {
      maskedData[key] = "*** MASKED ***";
    }
    // İç içe objeler veya diziler için tekrar işle
    else if (typeof maskedData[key] === "object" && maskedData[key] !== null) {
      maskedData[key] = maskSensitiveData(maskedData[key]);
    }
  }

  return maskedData;
};

// Axios instance oluştur
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // API yanıtını al
    const url = response.config.url;
    const method = response.config.method.toUpperCase();
    const status = response.status;
    const endpoint = url.replace(API_URL, "");

    // Yanıt verilerinde hassas bilgileri maskele
    const maskedData = maskSensitiveData(response.data);

    // Formatlı log göster
    logApiResponse(method, endpoint, status, maskedData);

    return response;
  },
  (error) => {
    // Basit hata yönetimi
    const isNetworkError = !error.response;
    const errMessage = isNetworkError
      ? "Sunucuya erişilemedi. İnternet bağlantınızı kontrol edin."
      : error.response?.data?.message || "Beklenmedik bir hata oluştu.";

    const errCode = isNetworkError
      ? "NETWORK_ERROR"
      : error.response?.data?.error?.code || "UNKNOWN_ERROR";

    // Hata loglaması
    if (error.config) {
      const method = error.config.method?.toUpperCase() || "REQUEST";
      const url = error.config.url || "UNKNOWN_URL";
      const status = error.response?.status || 0;
      const endpoint = url.replace(API_URL, "") || "/unknown";

      // Hata verilerinde de hassas bilgileri maskele
      const errorData = {
        code: errCode,
        message: errMessage,
        details: error.response?.data
          ? maskSensitiveData(error.response.data)
          : null,
      };

      logApiResponse(method, endpoint, status, errorData);
    }

    return Promise.reject({
      message: errMessage,
      code: errCode,
      status: error.response?.status,
      isNetworkError,
    });
  }
);

export default instance;
