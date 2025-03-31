import { useState, useEffect } from "react";
import { exportLogs, clearLogs } from "../utils/logger";

/**
 * Log Görüntüleyici Bileşeni
 * Bu bileşen, uygulamadaki logları görüntülemek, filtrelemek ve dışa aktarmak için kullanılır.
 */
function LogViewer() {
  // State değişkenleri
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("");
  const [moduleOptions, setModuleOptions] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);

  // Kayıtlı logları yükle
  useEffect(() => {
    loadLogs();
  }, []);

  // Modül seçeneklerini belirle
  useEffect(() => {
    if (logs.length > 0) {
      const modules = [...new Set(logs.map((log) => log.module))].sort();
      setModuleOptions(modules);
    }
  }, [logs]);

  // Logları yükle
  const loadLogs = () => {
    try {
      const storedLogs = localStorage.getItem("application_logs") || "[]";
      const parsedLogs = JSON.parse(storedLogs);
      setLogs(parsedLogs.reverse()); // En yeni loglar üstte
    } catch (e) {
      console.error("Logları yükleme hatası:", e);
      setLogs([]);
    }
  };

  // Logları temizle
  const handleClearLogs = () => {
    if (window.confirm("Tüm logları silmek istediğinize emin misiniz?")) {
      if (clearLogs()) {
        setLogs([]);
        alert("Loglar başarıyla temizlendi.");
      } else {
        alert("Logları temizlerken bir hata oluştu.");
      }
    }
  };

  // Logları dışa aktar
  const handleExportLogs = () => {
    if (exportLogs()) {
      alert("Loglar başarıyla dışa aktarıldı.");
    } else {
      alert("Logları dışa aktarırken bir hata oluştu.");
    }
  };

  // Filtreli logları getir
  const getFilteredLogs = () => {
    return logs.filter((log) => {
      // Metin filtresi
      const textMatch =
        filter === "" ||
        JSON.stringify(log).toLowerCase().includes(filter.toLowerCase());

      // Seviye filtresi
      const levelMatch = levelFilter === "all" || log.level === levelFilter;

      // Modül filtresi
      const moduleMatch = moduleFilter === "" || log.module === moduleFilter;

      return textMatch && levelMatch && moduleMatch;
    });
  };

  // Log seviyesine göre renk belirle
  const getLevelColor = (level) => {
    switch (level) {
      case "debug":
        return "bg-purple-100 text-purple-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrelenmiş loglar
  const filteredLogs = getFilteredLogs();

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Uygulama Logları</h2>
        <p className="text-gray-600 mb-4">
          Uygulama loglarını görüntüleyebilir, filtreleyebilir ve dışa
          aktarabilirsiniz.
        </p>

        {/* Kontrol ve Filtre Bölümü */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Loglarda ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="all">Tüm Seviyeler</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="">Tüm Modüller</option>
              {moduleOptions.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportLogs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Logları Dışa Aktar
          </button>

          <button
            onClick={handleClearLogs}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logları Temizle
          </button>
        </div>

        {/* İstatistik Bilgisi */}
        <div className="text-sm text-gray-500 mb-2">
          Toplam: {logs.length} log | Filtrelenmiş: {filteredLogs.length} log
        </div>
      </div>

      {/* Log Listesi */}
      <div className="overflow-auto rounded border">
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Görüntülenecek log bulunamadı.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zaman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seviye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modül
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mesaj
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detaylar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(
                        log.level
                      )}`}
                    >
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.module}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        setExpandedLog(expandedLog === index ? null : index)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedLog === index ? "Gizle" : "Göster"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detaylı Log Görünümü */}
      {expandedLog !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h3 className="text-lg font-medium mb-2">Log Detayları</h3>
          <pre className="p-4 bg-gray-800 text-gray-100 rounded overflow-auto text-sm">
            {JSON.stringify(filteredLogs[expandedLog], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default LogViewer;
