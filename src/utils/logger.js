/**
 * Merkezi loglama ve bilgilendirme mekanizması
 * Bu modül, uygulama genelinde tutarlı loglama ve bilgilendirme sağlar.
 */

// Ortam değişkenlerini al
const isProduction = import.meta.env.PROD;
const enableLoggingEnv = import.meta.env.VITE_ENABLE_LOGGING === "true";
const logLevel = import.meta.env.VITE_LOG_LEVEL || "debug";
const appName = import.meta.env.VITE_APP_NAME || "Fin AI Blog";
const appVersion = import.meta.env.VITE_APP_VERSION || "1.0.0";

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
 * Hassas verileri tespit edip maskeler
 * @param {Object} obj - İncelenecek obje
 * @returns {Object} - Hassas verileri maskelenmiş obje
 */
function sanitizeData(obj) {
  // Obje değilse veya null ise direkt olarak döndür
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Tarih objesi ise string'e çevir
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Dizi ise elemanlarını kontrol et
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeData(item));
  }

  // Objenin kopyasını oluştur
  const sanitized = { ...obj };

  // Objenin her alanını kontrol et
  Object.keys(sanitized).forEach((key) => {
    // Hassas veri kontrolü
    const isSensitive = SENSITIVE_DATA_PATTERNS.some((pattern) =>
      pattern.test(key)
    );

    if (isSensitive) {
      // Hassas veri alanlarını maskele
      sanitized[key] =
        typeof sanitized[key] === "string" ? "***MASKED***" : null;
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      // Alt objeleri de kontrol et
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
}

/**
 * Belirli bir log seviyesinin gösterilip gösterilmeyeceğini kontrol eder
 * @param {string} level - Log seviyesi
 * @returns {boolean} - Log gösterilmeli mi?
 */
function shouldLog(level) {
  return (
    (!isProduction || (isProduction && level === "error")) &&
    enableLoggingEnv &&
    LOG_LEVELS[level] >= currentLogLevel
  );
}

/**
 * Korelasyon ID'si oluşturur
 * @returns {string} - UUID formatında korelasyon ID'si
 */
function generateCorrelationId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Genel korelasyon ID'si - sayfa yüklendiğinde bir kez oluşturulur
const generalCorrelationId = generateCorrelationId();

/**
 * Tarayıcı ve kullanıcı bilgilerini alır
 * @returns {Object} - Kullanıcı ajanı ve diğer bilgiler
 */
function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}

/**
 * Standart log objesi oluşturur
 * @param {string} level - Log seviyesi
 * @param {string} module - Modül adı
 * @param {string} message - Log mesajı
 * @param {Object} additionalData - Ek veri
 * @returns {Object} - Standart log objesi
 */
function createLogObject(level, module, message, additionalData = null) {
  const timestamp = new Date().toISOString();
  const environment = isProduction ? "production" : "development";
  const userInfo = getBrowserInfo();

  // Temel log yapısı
  const logObject = {
    timestamp,
    level,
    service: appName,
    module,
    message,
    environment,
    request: {
      url: window.location.href,
      userAgent: userInfo.userAgent,
    },
    correlationId: generalCorrelationId,
    appVersion,
  };

  // Ek veriyi ekle
  if (additionalData) {
    if (additionalData instanceof Error) {
      logObject.error = {
        name: additionalData.name,
        message: additionalData.message,
        // Stack trace'i sadece development ortamında ekle
        stack: !isProduction ? additionalData.stack : undefined,
      };
    } else {
      logObject.data = sanitizeData(additionalData);
    }
  }

  return logObject;
}

/**
 * Log objesini konsola ve dosyaya yazar
 * @param {Object} logObject - Log objesi
 * @param {string} consoleStyle - Konsol stil bilgisi
 */
function writeLog(logObject, consoleStyle) {
  // Konsolda gösterme
  console.log(
    `%c[${logObject.level.toUpperCase()}] ${logObject.module}: ${
      logObject.message
    }`,
    consoleStyle,
    logObject
  );

  // Log objesini JSON formatına çevir
  const logJson = JSON.stringify(logObject);

  // Log dosyasına yazmak için localStorage kullan
  // Not: Bu bir workaround, gerçek uygulamada sunucu taraflı loglama kullanılmalı
  try {
    const storedLogs = localStorage.getItem("application_logs") || "[]";
    const logs = JSON.parse(storedLogs);
    logs.push(logObject);

    // Son 1000 logu tut (maksimum localStorage büyüklüğünü aşmamak için)
    if (logs.length > 1000) {
      logs.shift(); // En eski logu çıkar
    }

    localStorage.setItem("application_logs", JSON.stringify(logs));
  } catch (e) {
    console.error("Log dosyasına yazma hatası:", e);
  }

  // Production ortamında gerçek bir API'ye gönderebiliriz
  if (isProduction && logObject.level === "error") {
    // TODO: Log sunucusuna gönderme işlemi
    // sendLogToServer(logJson);
  }
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
    const logObject = createLogObject(
      "debug",
      "Component",
      `${componentName} render edildi. Toplam render sayısı: ${newCount}`,
      { component: componentName, renderCount: newCount }
    );

    writeLog(logObject, "color: #6b7280; font-style: italic;");
  }
}

/**
 * Bilgi mesajı loglar
 */
export function logInfo(module, message, data = null) {
  if (shouldLog("info")) {
    const logObject = createLogObject("info", module, message, data);
    writeLog(logObject, "color: #3b82f6; font-weight: bold;");
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
    const logObject = createLogObject("error", module, message, error);
    writeLog(logObject, "color: #ef4444; font-weight: bold;");
  }
}

/**
 * Uyarı mesajı loglar
 */
export function logWarning(module, message, data = null) {
  if (shouldLog("warning")) {
    const logObject = createLogObject("warning", module, message, data);
    writeLog(logObject, "color: #f59e0b; font-weight: bold;");
  }
}

/**
 * Debug mesajı loglar
 */
export function logDebug(module, message, data = null) {
  if (shouldLog("debug")) {
    const logObject = createLogObject("debug", module, message, data);
    writeLog(logObject, "color: #8b5cf6; font-weight: bold;");
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
    const logObject = createLogObject("success", module, message, data);
    writeLog(logObject, "color: #10B981; font-weight: bold;");
  }
}

/**
 * Kaydedilen logları dışa aktarır (indirilebilir dosya olarak)
 * @returns {boolean} - İşlem başarılı mı?
 */
export function exportLogs() {
  try {
    const logs = localStorage.getItem("application_logs") || "[]";
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${appName.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.json`;
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
 * @returns {boolean} - İşlem başarılı mı?
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

// Varsayılan olarak tüm fonksiyonları dışa aktar
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
