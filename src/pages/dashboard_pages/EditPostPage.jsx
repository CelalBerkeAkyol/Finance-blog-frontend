import React from "react";
import EditPostComponent from "../../components/blog_components/blog_dashboard/blog_post/EditPostComponent";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

export default function EditPostPage() {
  return (
    <div className="flex flex-1">
      <BlogSidebarComponent />
      <EditPostComponent />
    </div>
  );
}
