/**
 * Merkezi loglama ve bilgilendirme mekanizması
 * Bu modül, uygulama genelinde tutarlı loglama ve bilgilendirme sağlar.
 */

// Ortam değişkenlerini al
const isProduction = import.meta.env.PROD;
const enableLoggingEnv = import.meta.env.VITE_ENABLE_LOGGING === "true";
const logLevel = import.meta.env.VITE_LOG_LEVEL || "debug";

// Log seviyeleri
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  success: 4, // Başarı log seviyesi
};

// Mevcut log seviyesi
const currentLogLevel = LOG_LEVELS[logLevel] || 0;

// Render sayılarını takip etmek için kullanılan Map
const renderCounts = new Map();

// Hassas veri anahtarları - loglanmaması gereken bilgileri tanımlayan regex desenler
const SENSITIVE_DATA_PATTERNS = [
  // Şifre ile ilgili alanlar
  /password/i,
  /şifre/i,
  /sifre/i,
  /parola/i,

  // Token ile ilgili alanlar
  /token/i,
  /jwt/i,
  /auth/i,
  /api[-_]?key/i,

  // Kredi kartı bilgileri
  /kart/i,
  /card/i,
  /cvv/i,
  /cvc/i,
  /expiry/i,
  /son[-_]?kullanma/i,

  // TC Kimlik ve kişisel bilgiler
  /tc[-_]?kimlik/i,
  /kimlik[-_]?no/i,
  /tc[-_]?no/i,
  /identity/i,
  /telefon/i,
  /phone/i,
  /e[-_]?mail/i,
  /email/i,
  /eposta/i,
  /e[-_]?posta/i,

  // Ödeme bilgileri
  /payment/i,
  /ödeme/i,
  /fatura/i,
  /invoice/i,
  /billing/i,
];

/**
 * Hassas verileri temizleyen fonksiyon
 * @param {any} data - Temizlenecek veri
 * @returns {any} - Hassas verilerden arındırılmış veri
 */
function sanitizeData(data) {
  // Data null veya undefined ise doğrudan döndür
  if (data == null) return data;

  // String ise ve token içeriyorsa maskele
  if (typeof data === "string") {
    // Token içeren string'leri maskele
    if (/bearer\s+/i.test(data) || /jwt/i.test(data) || data.length > 30) {
      return "[MASKED_SENSITIVE_DATA]";
    }
    return data;
  }

  // Hata nesnesi ise
  if (data instanceof Error) {
    // Hata mesajı ve stack trace'i kopyala, hassas veri filtreleme yap
    const sanitizedError = new Error(data.message);
    sanitizedError.stack = data.stack;
    sanitizedError.name = data.name;
    return sanitizedError;
  }

  // Obje veya dizi ise, deep copy yaparak temizle
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map((item) => sanitizeData(item));
    }

    // Obje ise
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Hassas veri içeren field'ları kontrol et
      const isSensitive = SENSITIVE_DATA_PATTERNS.some((pattern) =>
        pattern.test(key)
      );

      if (isSensitive) {
        sanitized[key] = "[MASKED_SENSITIVE_DATA]";
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  // Diğer primitif tipler (number, boolean, vs) için direkt döndür
  return data;
}

/**
 * Belirli bir log seviyesinin gösterilip gösterilmeyeceğini kontrol eder
 * @param {string} level - Log seviyesi
 * @returns {boolean} - Log gösterilmeli mi?
 */
function shouldLog(level) {
  return (
    !isProduction && enableLoggingEnv && LOG_LEVELS[level] >= currentLogLevel
  );
}

/**
 * Bileşen render sayısını takip eder ve loglar
 * @param {string} componentName - Bileşen adı
 * @param {boolean} forceLogging - Ortam değişkenlerini göz ardı ederek loglama yapar mı?
 */
export function logRender(componentName, forceLogging = false) {
  if (!renderCounts.has(componentName)) {
    renderCounts.set(componentName, 0);
  }

  const newCount = renderCounts.get(componentName) + 1;
  renderCounts.set(componentName, newCount);

  if (shouldLog("debug") || forceLogging) {
    console.log(
      `%c${componentName} render edildi. Toplam render sayısı: ${newCount}`,
      "color: #6b7280; font-style: italic;"
    );
  }
}

/**
 * Bilgi mesajı loglar
 */
export function logInfo(module, message, data = null) {
  if (shouldLog("info")) {
    console.info(
      `%c[INFO] ${module}: ${message}`,
      "color: #3b82f6; font-weight: bold;",
      data ? sanitizeData(data) : ""
    );
  }
}

/**
 * Hata mesajı loglar
 * @param {string} module - Modül adı
 * @param {string} message - Hata mesajı
 * @param {any} error - Hata objesi veya mesajı
 */
export function logError(module, message, error = null) {
  // İptal edilen istekleri (AbortError) loglama
  if (
    error &&
    ((typeof error === "string" && error.includes("cancel")) ||
      error.name === "AbortError" ||
      error.code === "ERR_CANCELED" ||
      (typeof error === "object" &&
        error.message &&
        error.message.includes("cancel")))
  ) {
    return;
  }

  if (shouldLog("error")) {
    console.error(
      `%c[ERROR] ${module}: ${message}`,
      "color: #ef4444; font-weight: bold;",
      error ? sanitizeData(error) : ""
    );
  }
}

/**
 * Uyarı mesajı loglar
 */
export function logWarning(module, message, data = null) {
  if (shouldLog("warning")) {
    console.warn(
      `%c[WARNING] ${module}: ${message}`,
      "color: #f59e0b; font-weight: bold;",
      data ? sanitizeData(data) : ""
    );
  }
}

/**
 * Debug mesajı loglar
 */
export function logDebug(module, message, data = null) {
  if (shouldLog("debug")) {
    console.debug(
      `%c[DEBUG] ${module}: ${message}`,
      "color: #8b5cf6; font-weight: bold;",
      data ? sanitizeData(data) : ""
    );
  }
}

/**
 * **Başarı mesajı loglar**
 * @param {string} module - Modül adı
 * @param {string} message - Başarı mesajı
 * @param {any} data - Opsiyonel veri
 */
export function logSuccess(module, message, data = null) {
  if (shouldLog("success")) {
    console.log(
      `%c[SUCCESS] ${module}: ${message}`,
      "color: #10B981; font-weight: bold;",
      data ? sanitizeData(data) : ""
    );
  }
}

// Varsayılan olarak tüm fonksiyonları dışa aktar
export default {
  logRender,
  logInfo,
  logError,
  logWarning,
  logDebug,
  logSuccess, // Yeni başarı log fonksiyonunu ekledik
};
