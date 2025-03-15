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

  // Sadece geliştirme ortamında ve loglama aktifse veya forceLogging true ise logla
  if (shouldLog("debug") || forceLogging) {
    console.log(
      `%c${componentName} render edildi. Toplam render sayısı: ${newCount}`,
      "color: #6b7280; font-style: italic;"
    );
  }
}

/**
 * Bilgi mesajı loglar
 * @param {string} module - Modül adı
 * @param {string} message - Mesaj
 * @param {any} data - Opsiyonel veri
 */
export function logInfo(module, message, data = null) {
  if (shouldLog("info")) {
    if (data) {
      console.info(
        `%c[INFO] ${module}: ${message}`,
        "color: #3b82f6; font-weight: bold;",
        data
      );
    } else {
      console.info(
        `%c[INFO] ${module}: ${message}`,
        "color: #3b82f6; font-weight: bold;"
      );
    }
  }
}

/**
 * Hata mesajı loglar
 * @param {string} module - Modül adı
 * @param {string} message - Mesaj
 * @param {any} error - Hata nesnesi
 */
export function logError(module, message, error = null) {
  if (shouldLog("error")) {
    if (error) {
      console.error(
        `%c[ERROR] ${module}: ${message}`,
        "color: #ef4444; font-weight: bold;",
        error
      );
    } else {
      console.error(
        `%c[ERROR] ${module}: ${message}`,
        "color: #ef4444; font-weight: bold;"
      );
    }
  }
}

/**
 * Uyarı mesajı loglar
 * @param {string} module - Modül adı
 * @param {string} message - Mesaj
 * @param {any} data - Opsiyonel veri
 */
export function logWarning(module, message, data = null) {
  if (shouldLog("warning")) {
    if (data) {
      console.warn(
        `%c[WARNING] ${module}: ${message}`,
        "color: #f59e0b; font-weight: bold;",
        data
      );
    } else {
      console.warn(
        `%c[WARNING] ${module}: ${message}`,
        "color: #f59e0b; font-weight: bold;"
      );
    }
  }
}

/**
 * Debug mesajı loglar
 * @param {string} module - Modül adı
 * @param {string} message - Mesaj
 * @param {any} data - Opsiyonel veri
 */
export function logDebug(module, message, data = null) {
  if (shouldLog("debug")) {
    if (data) {
      console.debug(
        `%c[DEBUG] ${module}: ${message}`,
        "color: #8b5cf6; font-weight: bold;",
        data
      );
    } else {
      console.debug(
        `%c[DEBUG] ${module}: ${message}`,
        "color: #8b5cf6; font-weight: bold;"
      );
    }
  }
}

// Varsayılan olarak tüm fonksiyonları dışa aktar
export default {
  logRender,
  logInfo,
  logError,
  logWarning,
  logDebug,
};
