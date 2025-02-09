// kategoriye özel postların listelendiği sayfa
import CategoryBasePosts from "../../components/blog_components/blog/CategoryBasePosts";
import CustomNavbar from "../../components/header/CustomNavbar";
import BannerComponent from "../../components/header/BannerComponent";
function CategoryBasePostsPage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <BannerComponent />
      <CustomNavbar />
      <CategoryBasePosts />
    </div>
  );
}

export default CategoryBasePostsPage;
