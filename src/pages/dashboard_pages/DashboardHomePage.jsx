import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import InfoComponent from "../../components/blog_components/blog_dashboard/info/InfoComponent";
import ServerStatus from "../../components/blog_components/blog_dashboard/info/ServerStatus";
function DashboardHomePage() {
  return (
    <div className="flex min-h-screen flex-1">
      <BlogSidebarComponent />

      {/* İçerik Alanı */}
      <div className="flex-1 p-6 flex flex-col gap-6 mx-auto w-min-[60%]">
        {/* Server Status Kartları */}
        <ServerStatus />

        {/* Info Kartları (Radial Charts) */}
        <InfoComponent />
      </div>
    </div>
  );
}
export default DashboardHomePage;
