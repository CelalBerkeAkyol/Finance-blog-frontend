import React, { useState } from "react";
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
import SearchModal from "../yardımcılar/SearchModal";
import { useSelector } from "react-redux";

export default function CustomNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate(); // Yönlendirme için `useNavigate` kullanılıyor.

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
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <>
      <Navbar className="bg-gray-50 w-screen" maxWidth="xl">
        <NavbarContent className="flex" justify="center">
          <p className="font-bold text-inherit text-lg">Fin AI</p>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex " justify="center">
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

        {/* Sağ Tarafa Eklenen Arama ve Kullanıcı Butonları */}
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
          {/* Login Icon */}

          {!isLoggedIn && (
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
