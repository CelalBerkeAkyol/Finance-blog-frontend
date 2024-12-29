import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import PostActionComponent from "../../components/blog_components/blog_dashboard/blog_post/PostActionComponent";

function BlogPostPage() {
  return (
    <div className="flex flex-row flex-1">
      <BlogSidebarComponent />
      <PostActionComponent />
    </div>
  );
}

export default BlogPostPage;
