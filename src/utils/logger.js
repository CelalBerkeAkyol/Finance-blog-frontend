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
      data || ""
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
      error || ""
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
      data || ""
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
      data || ""
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
      data || ""
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
