import React from "react";
import AddPost from "../../components/blog_components/blog_dashboard/blog_post/AddPost";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const NewPostPage = () => {
  return (
    <div className="flex flex-1">
      <BlogSidebarComponent />
      <AddPost />
    </div>
  );
};

export default NewPostPage;
