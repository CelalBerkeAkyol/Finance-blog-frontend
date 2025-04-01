import LogViewer from "../components/LogViewer";
import BlogSidebarComponent from "../components/blog_components/blog_dashboard/BlogSidebarComponent";

/**
 * Admin Loglama Sayfası
 * Bu sayfa, loglama sistemini görüntülemek için kullanılır.
 */
function AdminLogsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 p-4 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6">Uygulama Loglama Yönetimi</h1>
        <LogViewer />
      </div>
    </div>
  );
}

export default AdminLogsPage;
