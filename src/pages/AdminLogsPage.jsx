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
        <LogViewer />
      </div>
    </div>
  );
}

export default AdminLogsPage;
