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
    // Basit veri tipiyse veya veri yoksa, sadece mesajı göster
    if (
      !logObject.data ||
      typeof logObject.data === "string" ||
      typeof logObject.data === "number" ||
      typeof logObject.data === "boolean"
    ) {
      console.log(
        `%c[${logObject.level.toUpperCase()}]: ${logObject.message}${
          logObject.data ? ` (${logObject.data})` : ""
        }`,
        consoleStyle,
        logObject
      );
    }
    // Veri karmaşık ise, açılabilir grup kullan
    else {
      // Grup başlığı
      console.groupCollapsed(
        `%c[${logObject.level.toUpperCase()}]: ${logObject.message}`,
        consoleStyle
      );

      // Veri detayları
      console.log(
        "%cDetails:",
        "font-weight: bold; margin-right: 4px;",
        logObject.data
      );

      // Ekstra bilgiler (opsiyonel)
      if (logObject.timestamp) {
        console.log(
          "%cTimestamp:",
          "font-weight: bold; margin-right: 4px;",
          new Date(logObject.timestamp).toLocaleTimeString()
        );
      }

      console.groupEnd();
    }
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
 * @param {string} message - Ana log mesajı
 * @param {any} data - Ek veri (null veya basit değer ise mesaja eklenir, obje ise ayrı gösterilir)
 */
export function logInfo(message, data = null) {
  // Basit mesaj kontrolü
  const isSimpleData =
    !data ||
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean";

  // Eğer basit veri ise, mesajı ve veriyi birleştir
  const enrichedMessage =
    isSimpleData && data ? `${message} (${data})` : message;

  const logObject = createLogObject(
    "info",
    enrichedMessage,
    isSimpleData ? null : data
  );
  writeLog(logObject, "color: #3b82f6;", shouldLog("info"));
}

/**
 * Hata mesajı loglar
 * @param {string} message - Ana hata mesajı
 * @param {Error|any} error - Hata objesi veya ek veri
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

  // Basit hata kontrolü
  const isSimpleError = error && typeof error === "string";

  // Eğer basit hata ise, mesajı ve hatayı birleştir
  const enrichedMessage = isSimpleError ? `${message} (${error})` : message;

  const logObject = createLogObject(
    "error",
    enrichedMessage,
    isSimpleError ? null : error
  );
  writeLog(logObject, "color: #ef4444; font-weight: bold;", shouldLog("error"));
}

/**
 * Uyarı mesajı loglar
 * @param {string} message - Ana uyarı mesajı
 * @param {any} data - Ek veri (null veya basit değer ise mesaja eklenir, obje ise ayrı gösterilir)
 */
export function logWarning(message, data = null) {
  // Basit veri kontrolü
  const isSimpleData =
    !data ||
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean";

  // Eğer basit veri ise, mesajı ve veriyi birleştir
  const enrichedMessage =
    isSimpleData && data ? `${message} (${data})` : message;

  const logObject = createLogObject(
    "warning",
    enrichedMessage,
    isSimpleData ? null : data
  );
  writeLog(logObject, "color: #f59e0b;", shouldLog("warning"));
}

/**
 * Debug mesajı loglar
 * @param {string} message - Ana debug mesajı
 * @param {any} data - Ek veri (null veya basit değer ise mesaja eklenir, obje ise ayrı gösterilir)
 */
export function logDebug(message, data = null) {
  // Basit veri kontrolü
  const isSimpleData =
    !data ||
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean";

  // Eğer basit veri ise, mesajı ve veriyi birleştir
  const enrichedMessage =
    isSimpleData && data ? `${message} (${data})` : message;

  const logObject = createLogObject(
    "debug",
    enrichedMessage,
    isSimpleData ? null : data
  );
  writeLog(logObject, "color: #8b5cf6;", shouldLog("debug"));
}

/**
 * Başarı mesajı loglar
 * @param {string} message - Ana başarı mesajı
 * @param {any} data - Ek veri (null veya basit değer ise mesaja eklenir, obje ise ayrı gösterilir)
 */
export function logSuccess(message, data = null) {
  // Basit veri kontrolü
  const isSimpleData =
    !data ||
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean";

  // Eğer basit veri ise, mesajı ve veriyi birleştir
  const enrichedMessage =
    isSimpleData && data ? `${message} (${data})` : message;

  const logObject = createLogObject(
    "success",
    enrichedMessage,
    isSimpleData ? null : data
  );
  writeLog(logObject, "color: #10B981;", shouldLog("success"));
}

/**
 * API Response loglarını formatlı ve renkli gösterir
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint (/auth/login, /posts, etc.)
 * @param {number} statusCode - HTTP status code (200, 201, 404, etc.)
 * @param {any} data - Opsiyonel response verisi (hassas veriler için null geçilebilir)
 */
export function logApiResponse(method, endpoint, statusCode, data = null) {
  // Determine log level based on status code
  const level = statusCode < 400 ? "success" : "error";

  // Check if logging should be performed using the existing shouldLog function
  if (!shouldLog(level)) {
    return; // Skip logging if not meeting log level requirements
  }

  // Status code'a göre renk ve durum belirle
  let color, status, bgColor;

  if (statusCode >= 200 && statusCode < 300) {
    color = "#10B981"; // yeşil
    bgColor = "rgba(16, 185, 129, 0.1)";
    status = "SUCCESS";
  } else if (statusCode >= 300 && statusCode < 400) {
    color = "#3b82f6"; // mavi
    bgColor = "rgba(59, 130, 246, 0.1)";
    status = "REDIRECT";
  } else if (statusCode >= 400 && statusCode < 500) {
    color = "#f59e0b"; // turuncu
    bgColor = "rgba(245, 158, 11, 0.1)";
    status = "CLIENT ERROR";
  } else if (statusCode >= 500) {
    color = "#ef4444"; // kırmızı
    bgColor = "rgba(239, 68, 68, 0.1)";
    status = "SERVER ERROR";
  } else {
    color = "#8b5cf6"; // mor
    bgColor = "rgba(139, 92, 246, 0.1)";
    status = "INFO";
  }

  // Log objesi oluştur
  const logObject = createLogObject(
    level,
    `API Response [${statusCode}] ${method} ${endpoint}`,
    data
  );

  const baseStyle = `color: ${color}; font-weight: bold; background: ${bgColor}; padding: 2px 6px; border-radius: 3px; border-left: 3px solid ${color};`;

  // Veri varsa, katlanabilir grup kullan
  if (data && shouldLog("debug")) {
    // Grup başlığını göster (tıklanabilir)
    console.groupCollapsed(
      `%c[${status}] API Response [${statusCode}] ${method} ${endpoint}`,
      baseStyle
    );

    // Grup içinde detay göster
    console.log(
      "%cEndpoint:",
      "font-weight: bold; margin-right: 4px;",
      `${method} ${endpoint}`
    );

    console.log(
      "%cStatus:",
      "font-weight: bold; margin-right: 4px;",
      `${statusCode} (${status})`
    );

    console.log(
      "%cResponse Data:",
      `color: ${color}; font-weight: bold; margin-right: 4px;`,
      data
    );

    // Bitti
    console.groupEnd();
  } else {
    // Veri yoksa sadece normal log göster
    console.log(
      `%c[${status}] API Response [${statusCode}] ${method} ${endpoint}`,
      baseStyle
    );
  }

  // Logları localStorage'a kaydet, konsola tekrar yazdırmadan
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

    // Logları ekle
    logs.push({
      ...logObject,
      // Özel formatlanmış log için stil bilgisini ekle
      _styleInfo: { color, bgColor, status },
    });

    // Son 1000 logu tut
    if (logs.length > 1000) logs.shift();

    localStorage.setItem("application_logs", JSON.stringify(logs));
  } catch (e) {
    // Sessizce devam et
  }
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
  logApiResponse,
  exportLogs,
  clearLogs,
};
