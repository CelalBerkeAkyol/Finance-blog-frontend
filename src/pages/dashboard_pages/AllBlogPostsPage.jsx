import BlogsTable from "../../components/blog_components/blog_dashboard/blog_post/BlogsTable";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

function AllBlogPostsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 overflow-x-auto">
        <BlogsTable />
      </div>
    </div>
  );
}

export default AllBlogPostsPage;
