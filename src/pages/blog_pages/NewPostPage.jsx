import React from "react";
import { useSelector } from "react-redux";
import AddPost from "../../components/blog_components/blog_dashboard/edit_posts/AddPost";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const NewPostPage = () => {
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Eğer kullanıcı admin değilse ve giriş yapmamışsa, erişim izni verme
  if (!isLoggedIn || !isAdmin) {
    console.log("Edit post page erişim isteyen kullanıcı yetkisiz!");
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
