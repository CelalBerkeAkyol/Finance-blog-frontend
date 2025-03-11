import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileComponent from "../../components/blog_components/blog_dashboard/users/ProfileComponent";
import { Spinner } from "@nextui-org/react";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, isLoggedIn, isLoading } = useSelector(
    (state) => state.user
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("ProfilePage mounted, userInfo:", userInfo);

    // Kullanıcı bilgisi yüklendiğinde
    if (!isLoading) {
      if (!isLoggedIn || !userInfo) {
        console.error("User not logged in, redirecting to login");
        navigate("/login");
        return;
      }

      // Kullanıcı rolünü kontrol et
      if (userInfo.role !== "admin" && userInfo.role !== "author") {
        console.error(
          "User does not have admin or author role, redirecting to home"
        );
        navigate("/");
        return;
      }

      console.log("User is authenticated with role:", userInfo.role);
      setIsReady(true);
    }
  }, [userInfo, isLoggedIn, isLoading, navigate]);

  // Yükleme durumunda gösterilecek içerik
  if (isLoading || !isReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Profil yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1">
      <BlogSidebarComponent />
      <div className="flex-1 p-6 flex flex-col gap-6 mx-auto">
        <h1 className="text-2xl font-bold">Profil Sayfası</h1>
        <p className="text-sm text-gray-500">
          Bu sayfada profil bilgilerinizi görüntüleyebilir ve
          düzenleyebilirsiniz.
        </p>
        <ProfileComponent userInfo={userInfo} />
      </div>
    </div>
  );
};

export default ProfilePage;
