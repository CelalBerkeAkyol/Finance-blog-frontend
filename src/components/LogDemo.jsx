import { useState } from "react";
import {
  logDebug,
  logInfo,
  logWarning,
  logError,
  logSuccess,
  exportLogs,
} from "../utils/logger";

/**
 * Loglama sistemi demo bileşeni
 * Bu bileşen, loglama sisteminin farklı seviyelerini test etmek için kullanılır.
 */
function LogDemo() {
  const [userId, setUserId] = useState("6392819");
  const [logCount, setLogCount] = useState(0);

  // Demo logları oluştur
  const createDemoLog = (level) => {
    const module = "LogDemo";
    const timestamp = new Date().toLocaleString();
    const count = logCount + 1;
    setLogCount(count);

    // Kullanıcı bilgileri - hassas veri maskelemeleri için test
    const userInfo = {
      id: userId,
      role: "user",
      email: "test@example.com",
      password: "secret123",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    };

    // Request bilgileri
    const requestInfo = {
      method: "POST",
      url: "/api/v1/login",
      ip: "192.168.1.45",
      userAgent: navigator.userAgent,
    };

    // Log seviyesine göre farklı mesajlar ve işlemler
    switch (level) {
      case "debug":
        logDebug(
          module,
          `Demo debug log #${count} oluşturuldu - ${timestamp}`,
          {
            detail: "Debug detayı",
            userInfo,
            requestInfo,
          }
        );
        break;

      case "info":
        logInfo(
          module,
          `Demo bilgi logu #${count} oluşturuldu - ${timestamp}`,
          {
            detail: "Bilgi detayı",
            userInfo,
          }
        );
        break;

      case "warning":
        logWarning(
          module,
          `Demo uyarı logu #${count} oluşturuldu - ${timestamp}`,
          {
            detail: "Uyarı detayı",
            warnings: ["İşlem yavaş tamamlandı", "Bağlantı zayıf"],
          }
        );
        break;

      case "error":
        try {
          // Hata simülasyonu
          throw new Error(`Demo hata #${count}: İşlem tamamlanamadı`);
        } catch (error) {
          logError(
            module,
            `Demo hata logu #${count} oluşturuldu - ${timestamp}`,
            error
          );
        }
        break;

      case "success":
        logSuccess(
          module,
          `Demo başarı logu #${count} oluşturuldu - ${timestamp}`,
          {
            detail: "Başarı detayı",
            operation: "Demo işlem",
            duration: "125ms",
          }
        );
        break;

      default:
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Loglama Sistemi Demo</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Kullanıcı ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => createDemoLog("debug")}
          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Debug Log Oluştur
        </button>

        <button
          onClick={() => createDemoLog("info")}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Bilgi Logu Oluştur
        </button>

        <button
          onClick={() => createDemoLog("warning")}
          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Uyarı Logu Oluştur
        </button>

        <button
          onClick={() => createDemoLog("error")}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Hata Logu Oluştur
        </button>

        <button
          onClick={() => createDemoLog("success")}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Başarı Logu Oluştur
        </button>

        <button
          onClick={exportLogs}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Logları Dışa Aktar
        </button>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        <p>Bu bileşen, loglama sistemini test etmek için kullanılır.</p>
        <p>
          Not: Tüm hassas veriler (parola, token vb.) otomatik olarak
          maskelenir.
        </p>
        <p>Oluşturulan log sayısı: {logCount}</p>
      </div>
    </div>
  );
}

export default LogDemo;
