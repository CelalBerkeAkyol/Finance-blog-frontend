import BlogsTable from "../../components/blog_components/blog_dashboard/blog_post/BlogsTable";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

function AllBlogPostsPage() {
  return (
    <div className="flex flex-row flex-1">
      <BlogSidebarComponent />
      <BlogsTable />
    </div>
  );
}

export default AllBlogPostsPage;
