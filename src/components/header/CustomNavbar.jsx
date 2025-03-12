import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import SearchModal from "../modals/SearchModal";
import { useSelector } from "react-redux";

import LogoutComponent from "../auth/LogoutComponent";

export default function CustomNavbar() {
  const renderCount = useRef(0);

  // Her render olduğunda sayaç artar ve konsola yazılır
  renderCount.current += 1;
  console.log(
    `BannerComponent render edildi. Toplam render sayısı: ${renderCount.current}`
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, userInfo, isAdmin } = useSelector((state) => state.user);

  const userName = userInfo?.username || userInfo?.userName || "Guest";
  const userRole = isAdmin ? "Admin" : "User";

  const navbarLinks = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Blog", path: "/blog/posts" },
    { name: "Araştırma", path: "/blog/category/arastirma" },
    { name: "Data Science", path: "/blog/category/data-science" },
    { name: "Machine Learning", path: "/blog/category/machine-learning" },
  ];

  const categories = [
    { name: "Makro Ekonomi", path: "/blog/category/makro-ekonomi" },
    { name: "Mikro Ekonomi", path: "/blog/category/mikro-ekonomi" },
    { name: "Finans", path: "/blog/category/finans" },
    { name: "Kişisel Finans", path: "/blog/category/kişisel-finans" },
  ];

  return (
    <>
      <Navbar className="bg-gray-50 w-screen" maxWidth="xl">
        <NavbarContent className="flex" justify="center">
          <p className="font-bold text-inherit text-lg">Fin AI</p>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex" justify="center">
          {navbarLinks.map((item, index) => (
            <NavbarItem key={index}>
              <button
                onClick={() => navigate(item.path)}
                className="hover:text-primary px-2"
              >
                {item.name}
              </button>
            </NavbarItem>
          ))}

          <Dropdown>
            <DropdownTrigger color="secondary">
              <Button
                variant="flat"
                className="text-gray-900 text-sm hover:text-secondary"
                endContent={
                  <Icon icon="material-symbols:arrow-drop-down" width="20" />
                }
              >
                Ekonomi & Finans
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Kategoriler" color="primary">
              {categories.map((item, index) => (
                <DropdownItem key={index} onClick={() => navigate(item.path)}>
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarContent justify="center">
          <NavbarItem>
            <Button
              variant="bordered"
              color="secondary"
              radius="lg"
              startContent={<Icon icon="material-symbols:search" width="14" />}
              size="md"
              onClick={() => setIsSearchOpen(true)}
            >
              Ara
            </Button>
          </NavbarItem>

          {/* Eğer kullanıcı giriş yapmışsa profil ve çıkış butonu */}
          {isLoggedIn ? (
            <>
              <NavbarItem>
                <Button
                  variant="ghost"
                  size="sm"
                  startContent={<Icon icon="ic:round-person" width="20" />}
                  onClick={() => navigate("/profile")}
                >
                  {userName} - {userRole}
                </Button>
              </NavbarItem>
              <NavbarItem>
                <LogoutComponent />
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <button
                  onClick={() => navigate("/login")}
                  className="pl-4 hover:text-primary"
                >
                  Login
                </button>
              </NavbarItem>

              <NavbarItem>
                <button
                  onClick={() => navigate("/register")}
                  className="hover:text-primary"
                >
                  Register
                </button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
