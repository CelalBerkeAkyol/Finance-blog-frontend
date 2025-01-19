// kategoriye özel postların listelendiği sayfa
import CategoryBasePosts from "../../components/blog_components/CategoryBasePosts";
import CustomNavbar from "../../components/header/CustomNavbar";

function CategoryBasePostsPage() {
  return (
    <div className="flex flex-col min-h-screen  gap-4">
      <CustomNavbar />
      <CategoryBasePosts />
    </div>
  );
}

export default CategoryBasePostsPage;
