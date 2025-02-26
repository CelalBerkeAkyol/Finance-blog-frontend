// src/components/header/CustomNavbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  // Arama modalının açılıp kapanma durumu
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Navbar Container */}
      <Navbar className="bg-gray-50 w-screen" maxWidth="xl">
        {/* Sol Taraf: Logo ve Başlık */}
        <NavbarContent className="flex" justify="center">
          <AcmeLogo />
          <p className="font-bold text-inherit text-lg">Fin AI</p>
        </NavbarContent>

        {/* Orta Kısım: Dropdown Menü */}

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {[
            "Ana Sayfa",
            "Finans",
            "Kişisel Finans",
            "Araştırma",
            "Data Science",
            "Machine Learning",
          ].map((item, index) => (
            <NavbarItem key={index}>
              <Link to="/blog/posts/">{item}</Link>
            </NavbarItem>
          ))}

          <Dropdown>
            <DropdownTrigger color="secondary">
              <Button variant="bordered">Tüm Kategoriler</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Kategoriler" color="primary">
              {[
                { name: "Makro Ekonomi", link: "/blog/makro-ekonomi/" },
                { name: "Mikro Ekonomi", link: "/blog/mikro-ekonomi/" },
                { name: "Finans", link: "/blog/finans/" },
                { name: "Kişisel Finans", link: "/blog/kisisel-finans/" },
                { name: "Araştırma", link: "/blog/arastirma/" },
                { name: "Data Science", link: "/blog/data-science/" },
                { name: "Machine Learning", link: "/blog/machine-learning/" },
              ].map((item, index) => (
                <DropdownItem key={index} as={Link} to={item.link}>
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        {/* Sağ Taraf: Arama Butonu */}
        <NavbarItem justify="end" className="mx-2 w-24">
          <Button
            variant="bordered"
            color="secondary"
            radius="lg"
            fullWidth={true}
            startContent={<Icon icon="material-symbols:search" width="16" />}
            size="md"
            onClick={() => setIsSearchOpen(true)}
          >
            Ara
          </Button>
        </NavbarItem>
      </Navbar>

      {/* Arama Modalı */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
