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
  const [showModal, setShowModal] = useState(false);

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

  // Detay modalını aç
  const openDetailModal = (index) => {
    setExpandedLog(index);
    setShowModal(true);
  };

  // Detay modalını kapat
  const closeDetailModal = () => {
    setShowModal(false);
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
                      onClick={() => openDetailModal(index)}
                      className="text-indigo-600 hover:text-primary"
                    >
                      Göster
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Log Detayı Modal */}
      {showModal && expandedLog !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Log Detayları</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Zaman:</span>{" "}
                {new Date(filteredLogs[expandedLog].timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Seviye:</span>{" "}
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(
                    filteredLogs[expandedLog].level
                  )}`}
                >
                  {filteredLogs[expandedLog].level.toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Mesaj:</span>{" "}
                {filteredLogs[expandedLog].message}
              </p>
            </div>

            <pre className="p-4 bg-gray-800 text-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(filteredLogs[expandedLog], null, 2)}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogViewer;
