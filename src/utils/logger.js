/**
 * Basitleştirilmiş Loglama Modülü
 */

// Temel ayarlar
const isProduction = import.meta.env.PROD;
const enableLoggingEnv = import.meta.env.VITE_ENABLE_LOGGING === "true";
const logLevel = import.meta.env.VITE_LOG_LEVEL || "debug";
const appName = import.meta.env.VITE_APP_NAME || "Fin AI Blog";

// Log seviyeleri
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  success: 4,
};

// Mevcut log seviyesi
const currentLogLevel = LOG_LEVELS[logLevel] || 0;

/**
 * Belirli bir log seviyesinin gösterilip gösterilmeyeceğini kontrol eder
 */
function shouldLog(level) {
  return (
    (!isProduction || level === "error") &&
    enableLoggingEnv &&
    LOG_LEVELS[level] >= currentLogLevel
  );
}

/**
 * Temel log objesi oluşturur
 */
function createLogObject(level, message, data = null) {
  return {
    timestamp: new Date().toISOString(),
    level,
    service: appName,
    message,
    environment: isProduction ? "production" : "development",
    url: window.location.href,
    data:
      data instanceof Error
        ? {
            message: data.message,
            name: data.name,
            stack: !isProduction ? data.stack : undefined,
          }
        : data,
  };
}

/**
 * Log objesini konsola ve localStorage'a yazar
 */
function writeLog(logObject, consoleStyle, shouldDisplay) {
  // Konsola sadece gerektiğinde yaz
  if (shouldDisplay) {
    console.log(
      `%c[${logObject.level.toUpperCase()}]: ${logObject.message}`,
      consoleStyle,
      logObject
    );
  }

  // Her zaman localStorage'a kaydet
  try {
    let logs = [];
    const storedLogs = localStorage.getItem("application_logs");

    if (storedLogs) {
      try {
        logs = JSON.parse(storedLogs);
        if (!Array.isArray(logs)) logs = [];
      } catch (e) {
        logs = [];
      }
    }

    logs.push(logObject);

    // Son 1000 logu tut
    if (logs.length > 1000) logs.shift();

    localStorage.setItem("application_logs", JSON.stringify(logs));
  } catch (e) {
    console.error("Log kaydetme hatası:", e);
  }
}

/**
 * Bileşen render sayısını loglar
 */
export function logRender(componentName, forceLogging = false) {
  const logObject = createLogObject("debug", `${componentName} render edildi`, {
    component: componentName,
  });
  writeLog(
    logObject,
    "color: #6b7280; font-style: italic;",
    shouldLog("debug") || forceLogging
  );
}

/**
 * Bilgi mesajı loglar
 */
export function logInfo(message, data = null) {
  const logObject = createLogObject("info", message, data);
  writeLog(logObject, "color: #3b82f6;", shouldLog("info"));
}

/**
 * Hata mesajı loglar
 */
export function logError(message, error = null) {
  // İptal edilen istekleri loglama
  if (
    error &&
    (error.name === "AbortError" ||
      (error.message && error.message.includes("cancel")))
  ) {
    return;
  }

  const logObject = createLogObject("error", message, error);
  writeLog(logObject, "color: #ef4444; font-weight: bold;", shouldLog("error"));
}

/**
 * Uyarı mesajı loglar
 */
export function logWarning(message, data = null) {
  const logObject = createLogObject("warning", message, data);
  writeLog(logObject, "color: #f59e0b;", shouldLog("warning"));
}

/**
 * Debug mesajı loglar
 */
export function logDebug(message, data = null) {
  const logObject = createLogObject("debug", message, data);
  writeLog(logObject, "color: #8b5cf6;", shouldLog("debug"));
}

/**
 * Başarı mesajı loglar
 */
export function logSuccess(message, data = null) {
  const logObject = createLogObject("success", message, data);
  writeLog(logObject, "color: #10B981;", shouldLog("success"));
}

/**
 * Logları dışa aktarır
 */
export function exportLogs() {
  try {
    const logs = localStorage.getItem("application_logs") || "[]";
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (e) {
    console.error("Log dışa aktarma hatası:", e);
    return false;
  }
}

/**
 * Kaydedilen logları temizler
 */
export function clearLogs() {
  try {
    localStorage.removeItem("application_logs");
    return true;
  } catch (e) {
    console.error("Log temizleme hatası:", e);
    return false;
  }
}

export default {
  logRender,
  logInfo,
  logError,
  logWarning,
  logDebug,
  logSuccess,
  exportLogs,
  clearLogs,
};
