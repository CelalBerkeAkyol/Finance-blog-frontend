// src/pages/blog_pages/BlogDashboardPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import AddPost from "../../components/blog_components/blog_dashboard/edit_posts/AddPost";

const NewPostPage = () => {
  const { userInfo } = useSelector((state) => state.user);

  // Yalnızca Admin ve Author rollerine izin ver
  const allowedRoles = ["admin", "author"];
  if (!allowedRoles.includes(userInfo?.role)) {
    console.log("Edit post page erişim isteyen kullanıcı :" + userInfo);
    return <p>Erişim izniniz yok.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Yönetim Paneli</h1>
      <AddPost />
    </div>
  );
};

export default NewPostPage;
