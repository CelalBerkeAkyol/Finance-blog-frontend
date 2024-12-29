import BlogPosts from "../../components/blog_components/blog_dashboard/blog_post/BlogsPosts";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

function BlogPostPage() {
  return (
    <div className="flex flex-row flex-1">
      <BlogSidebarComponent />
      <BlogPosts />
    </div>
  );
}

export default BlogPostPage;
