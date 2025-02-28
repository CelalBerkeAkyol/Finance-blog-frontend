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

// Logo Bileşeni
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

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

  return (
    <>
      <Navbar className="bg-gray-50 w-screen" maxWidth="xl">
        <NavbarContent className="flex" justify="start">
          <AcmeLogo />
          <p className="font-bold text-inherit text-lg">Fin AI</p>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-2" justify="start">
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
        <NavbarContent justify="end" className="gap-4">
          <NavbarItem>
            <Button
              variant="bordered"
              color="secondary"
              radius="lg"
              startContent={<Icon icon="material-symbols:search" width="16" />}
              size="md"
              onClick={() => setIsSearchOpen(true)}
            >
              Ara
            </Button>
          </NavbarItem>

          {/* Login Icon */}
          <NavbarItem>
            <button
              onClick={() => navigate("/login")}
              className=" pl-4 hover:text-primary"
            >
              Login
            </button>
          </NavbarItem>

          {/* Register Icon */}
          <NavbarItem>
            <button
              onClick={() => navigate("/register")}
              className=" hover:text-primary"
            >
              Register
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
