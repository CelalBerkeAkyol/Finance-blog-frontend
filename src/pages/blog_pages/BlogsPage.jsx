// tüm postların listelendiği sayfa
import BlogsComponent from "../../components/blog_components/blog/BlogsComponent";

import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BannerComponent />
      <CustomNavbar />
      <BlogsComponent />
    </div>
  );
}

export default BlogsPage;
