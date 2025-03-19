import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import UserListComponent from "../../components/blog_components/blog_dashboard/users/UserListComponent";

function UsersPage() {
  const { isAdmin, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Sadece admin kullanıcılar erişebilir
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/dashboard/home");
    } else {
      setIsAuthorized(true);
    }
  }, [isAdmin, isLoggedIn, navigate]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Yetkilendiriliyor...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />

      {/* İçerik Alanı */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-x-auto">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-gray-500">
          Bu sayfada tüm kullanıcıları görüntüleyebilir ve yönetebilirsiniz.
          Sadece admin yetkisine sahip kullanıcılar bu sayfaya erişebilir.
        </p>
        <UserListComponent />
      </div>
    </div>
  );
}

export default UsersPage;
