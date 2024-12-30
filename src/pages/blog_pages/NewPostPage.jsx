// src/pages/blog_pages/BlogDashboardPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import AddPost from "../../components/blog_components/blog_dashboard/edit_posts/AddPost";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const NewPostPage = () => {
  const { userInfo } = useSelector((state) => state.user);

  // Yalnızca Admin ve Author rollerine izin ver
  const allowedRoles = ["admin", "author"];
  if (!allowedRoles.includes(userInfo?.role)) {
    console.log("Edit post page erişim isteyen kullanıcı :" + userInfo);
    return <p>Erişim izniniz yok.</p>;
  }

  return (
    <div className="flex flex-1">
      <BlogSidebarComponent />
      <AddPost />
    </div>
  );
};

export default NewPostPage;
