import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import InfoComponent from "../../components/blog_components/blog_dashboard/info/InfoComponent";
import ServerStatus from "../../components/blog_components/blog_dashboard/info/ServerStatus";

function DashboardHomePage() {
  return (
    <div className="flex min-h-screen flex-1 overflow-hidden">
      <BlogSidebarComponent />

      {/* İçerik Alanı */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-y-auto w-full">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Dashboard</h1>

          {/* Server Status Kartları */}
          <ServerStatus />

          {/* Info Kartları (Radial Charts) */}
          <InfoComponent />
        </div>
      </div>
    </div>
  );
}

export default DashboardHomePage;
