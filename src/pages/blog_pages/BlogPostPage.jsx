// ID verilen bir blog postun gösterildiği sayfa
import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function BlogPostPage() {
  return (
    <div className="flex flex-col gap-4">
      <BannerComponent />
      <CustomNavbar />
      <BlogPostComponent />
    </div>
  );
}

export default BlogPostPage;
