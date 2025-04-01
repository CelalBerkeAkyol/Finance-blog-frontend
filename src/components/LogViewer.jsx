import { useState, useEffect } from "react";
import { exportLogs, clearLogs } from "../utils/logger";

/**
 * Basitleştirilmiş Log Görüntüleyici
 */
function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [expandedLog, setExpandedLog] = useState(null);
  const [loading, setLoading] = useState(false);

  // Logları yükle
  useEffect(() => {
    loadLogs();
  }, []);

  // Logları yükle
  const loadLogs = () => {
    try {
      setLoading(true);
      const storedLogs = localStorage.getItem("application_logs");

      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs.reverse()); // En yeni loglar üstte
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error("Logları yükleme hatası:", e);
      setLogs([]);
    } finally {
      setLoading(false);
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
  const filteredLogs = logs.filter((log) => {
    // Metin filtresi
    const textMatch =
      filter === "" ||
      JSON.stringify(log).toLowerCase().includes(filter.toLowerCase());

    // Seviye filtresi
    const levelMatch = levelFilter === "all" || log.level === levelFilter;

    return textMatch && levelMatch;
  });

  // Log seviyesine göre renk belirle
  const getLevelColor = (level) => {
    const colors = {
      debug: "bg-purple-100 text-purple-800",
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      success: "bg-green-100 text-green-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Uygulama Logları</h2>

        {/* Kontrol ve Filtre Bölümü */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Loglarda ara..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 min-w-[200px] p-2 border rounded"
          />

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

          <button
            onClick={loadLogs}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "Yenile"}
          </button>

          <button
            onClick={handleExportLogs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Dışa Aktar
          </button>

          <button
            onClick={handleClearLogs}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Temizle
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
          <div className="p-8 text-center text-gray-500">
            <h3 className="text-lg font-medium mb-2">
              Görüntülenecek log bulunamadı
            </h3>
            <p className="mb-4">
              {logs.length === 0
                ? "Henüz kaydedilmiş log bulunmuyor."
                : "Filtrelere uygun log bulunamadı. Lütfen filtreleri değiştirin."}
            </p>
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
                  Mesaj
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detay
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
