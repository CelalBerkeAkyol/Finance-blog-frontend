import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileComponent from "../../components/blog_components/blog_dashboard/users/ProfileComponent";
import { Spinner } from "@nextui-org/react";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";

const ProfilePage = () => {
  const { isLoading } = useSelector((state) => state.user);

  // Yükleme durumunda gösterilecek içerik
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Profil yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold">Profil Sayfası</h1>
        <p className="text-sm text-gray-500 mb-4">
          Bu sayfada profil bilgilerinizi görüntüleyebilir ve
          düzenleyebilirsiniz.
        </p>
        <ProfileComponent />
      </div>
    </div>
  );
};

export default ProfilePage;
