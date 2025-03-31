import { useState } from "react";
import LogViewer from "../components/LogViewer";
import LogDemo from "../components/LogDemo";
import BlogSidebarComponent from "../components/blog_components/blog_dashboard/BlogSidebarComponent";

/**
 * Admin Loglama Sayfası
 * Bu sayfa, loglama sistemini yönetmek ve görüntülemek için kullanılır.
 */
function AdminLogsPage() {
  const [activeTab, setActiveTab] = useState("viewer");

  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 p-4 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6">Uygulama Loglama Yönetimi</h1>

        {/* Tab Seçenekleri */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "viewer"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("viewer")}
          >
            Log Görüntüleyici
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "demo"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("demo")}
          >
            Log Oluşturucu (Demo)
          </button>
        </div>

        {/* Tab İçeriği */}
        <div className="mt-4">
          {activeTab === "viewer" ? <LogViewer /> : <LogDemo />}
        </div>
      </div>
    </div>
  );
}

export default AdminLogsPage;
