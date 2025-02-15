// src/components/header/AdminNavbar.jsx
import React, { useEffect } from "react";
import { Navbar, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logoutUser } from "../../app/features/user/userSlice";

export default function AdminNavbar() {
  const dispatch = useDispatch();
  const { userInfo, isAdmin, isLoggedIn } = useSelector((state) => state.user);

  const userName = userInfo?.username || "Guest";
  const userRole = isAdmin ? "Admin" : "User";

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogoutClick = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        window.location.href = "/blog-admin/login";
      })
      .catch((error) => {
        console.error("Logout sırasında hata oluştu:", error);
      });
  };

  return (
    <Navbar className="border-b-1 bg-gray-800 text-white">
      <NavbarContent className="w-full" justify="center">
        <NavbarItem>
          <Link to="/dashboard/home">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/posts">Posts</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/dashboard/post/new">New Post</Link>
        </NavbarItem>
      </NavbarContent>

      {/* Sağ kısım */}
      <NavbarContent justify="end" className="gap-4">
        {isLoggedIn && (
          <>
            {/* Profil butonu (sadece ikon) */}
            <NavbarItem>
              <Button
                variant="ghost"
                size="sm"
                startContent={
                  <Icon icon="ic:round-person" width="20" color="white" />
                }
                as={Link}
                to="/profile"
                className="text-white"
              >
                {`${userName} - ${userRole}`}
              </Button>
            </NavbarItem>
            {/* Çıkış butonu (sadece ikon) */}
            <NavbarItem>
              <Button
                variant="bordered"
                size="sm"
                startContent={
                  <Icon icon="ic:round-logout" width="20" color="white" />
                }
                onClick={handleLogoutClick}
                className="text-white"
              >
                Çıkış
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
