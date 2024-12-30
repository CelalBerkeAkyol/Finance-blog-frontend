import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import Footer from "../../components/footer/Footer";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function BlogPostPage() {
  return (
    <div className="flex flex-col gap-4">
      <BannerComponent />
      <CustomNavbar />
      <BlogPostComponent />
      <Footer />
    </div>
  );
}

export default BlogPostPage;
