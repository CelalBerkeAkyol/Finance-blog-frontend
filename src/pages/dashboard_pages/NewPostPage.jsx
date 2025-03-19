import React from "react";
import AddPost from "../../components/blog_components/blog_dashboard/blog_post/AddPost";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const NewPostPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 overflow-x-auto">
        <AddPost />
      </div>
    </div>
  );
};

export default NewPostPage;
