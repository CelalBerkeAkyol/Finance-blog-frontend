// src/api.js
import axios from "axios";
import { logError, logSuccess } from "./utils/logger";

// Ortam değişkenlerinden API URL'sini al
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/blog";

// Hassas veri içeren endpoint'lerin listesi
const SENSITIVE_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/user",
  "/payment",
  "/billing",
  "/profile",
];

// Hassas veri içeren bir endpoint olup olmadığını kontrol eden fonksiyon
const isSensitiveEndpoint = (url) => {
  if (!url) return false;
  return SENSITIVE_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// Mobil erişim için daha geniş yetkilendirmeler
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cookie gönderimi için gerekli
  timeout: 30000, // Mobil ağlar için daha uzun timeout (30 saniye)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - hassas veri içeren istekleri loglama
instance.interceptors.request.use(
  (config) => {
    // Hassas veriler içeren endpoint'lere istek yapılıyorsa, veri içeriğini log'a ekleme
    if (isSensitiveEndpoint(config.url)) {
      // Bu noktada bir şey loglamıyoruz, sadece config'i değiştirmeden geçiriyoruz
      // Logger fonksiyonları zaten verileri temizleyecek
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - merkezi hata yönetimi ve başarılı cevapları loglama
instance.interceptors.response.use(
  (response) => {
    // API başarılı bir yanıt döndürdüğünde logla (sadece geliştirme ortamında)
    if (!import.meta.env.PROD) {
      // Hassas endpoint kontrolü
      const url = response.config.url;
      const method = response.config.method.toUpperCase();

      // Hassas endpoint için log mesajını düzenle, içeriği değil
      if (isSensitiveEndpoint(url)) {
        logSuccess(
          "API Response",
          `[${response.status}] ${method} ${url} - Sensitive Data Response`,
          // Veri logger tarafından sanitize edilecek
          response.data
        );
      } else {
        logSuccess(
          "API Response",
          `[${response.status}] ${method} ${url}`,
          response.data
        );
      }
    }
    return response; // Cevabı döndür
  },
  (error) => {
    // AbortError'ları (kullanıcı tarafından iptal edilen istekleri) hata olarak işleme
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      return Promise.reject({
        message: "İstek iptal edildi",
        code: "REQUEST_CANCELED",
        status: 0,
        isAborted: true,
      });
    }

    // Hata objesi yapısını kontrol et
    // Bazen bağlantı hatası, timeout gibi durumlarda error.response olmayabilir
    const isNetworkError = !error.response;

    let errMessage, errCode;

    if (isNetworkError) {
      // Ağ hatası, bağlantı hatası veya timeout durumu
      errMessage =
        error.message ||
        "Sunucuya erişilemedi. İnternet bağlantınızı kontrol edin.";
      errCode = "NETWORK_ERROR";
    } else {
      // API'den dönen hata
      errMessage =
        error.response?.data?.message || "Beklenmedik bir hata oluştu.";
      errCode = error.response?.data?.error?.code || "UNKNOWN_ERROR";
    }

    // Global logging - sadece geliştirme ortamında
    if (!import.meta.env.PROD) {
      const url = error.config?.url || "UNKNOWN_URL";
      const method = error.config?.method?.toUpperCase() || "REQUEST";

      // Hassas endpoint kontrolü
      if (isSensitiveEndpoint(url)) {
        logError(
          "API",
          `[${
            error.response?.status || "NETWORK_ERROR"
          }] ${method} ${url} - Sensitive Data Error --> ${errCode}`,
          errMessage
        );
      } else {
        logError(
          "API",
          `[${
            error.response?.status || "NETWORK_ERROR"
          }] ${method} ${url} --> ${errCode}`,
          errMessage
        );
      }
    }

    return Promise.reject({
      message: errMessage,
      code: errCode,
      status: error.response?.status,
      isNetworkError: isNetworkError,
    });
  }
);

export default instance;
