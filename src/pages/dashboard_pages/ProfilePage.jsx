import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import ProfileComponent from "../../components/blog_components/blog_dashboard/users/ProfileComponent";
import { fetchUser } from "../../app/features/user/userSlice";

function ProfilePage() {
  const { isLoading, isProfileLoaded } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* aynı mount içinde ikinci kez denemeyi engeller */
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (isProfileLoaded || hasFetchedOnce.current) return; // veri tam / denenmiş
    dispatch(fetchUser())
      .unwrap()
      .catch((err) => {
        console.error("Kullanıcı bilgileri alınamadı:", err);
        navigate("/login");
      });
    hasFetchedOnce.current = true;
  }, [dispatch, navigate, isProfileLoaded]);

  if (isLoading || !isProfileLoaded) {
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
        <ProfileComponent />
      </div>
    </div>
  );
}

export default ProfilePage;
