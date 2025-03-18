import React, { useState, useRef, useCallback, memo } from "react";
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
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarBrand,
} from "@nextui-org/react";
import SearchModal from "../modals/SearchModal";
import { useSelector } from "react-redux";
import { logRender } from "../../utils/logger";

import LogoutComponent from "../auth/LogoutComponent";

// Navbar bağlantıları ve kategorileri bileşen dışına taşıyarak her render'da yeniden oluşturulmasını önlüyoruz
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

// Seçici fonksiyonları bileşen dışına taşıyarak her render'da yeniden oluşturulmasını önlüyoruz
const selectIsLoggedIn = (state) => state.user.isLoggedIn;
const selectUserInfo = (state) => state.user.userInfo;
const selectIsAdmin = (state) => state.user.isAdmin;

function CustomNavbar() {
  const renderCount = useRef(0);

  // Her render olduğunda sayaç artar ve konsola yazılır
  renderCount.current += 1;
  logRender("CustomNavbar", false); // false parametresi ile loglama kapatılabilir

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // useSelector kullanımını optimize ediyoruz, her bir değeri ayrı ayrı seçerek
  // sadece değişen değerler için yeniden render tetiklenmesini sağlıyoruz
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userInfo = useSelector(selectUserInfo);
  const isAdmin = useSelector(selectIsAdmin);

  const userName = userInfo?.username || userInfo?.userName || "Guest";
  const userRole = userInfo?.role || "User";

  // Admin veya author rolüne sahip kullanıcılar profil sayfasına erişebilir
  const canAccessProfile =
    userInfo?.role === "admin" || userInfo?.role === "author";

  // Fonksiyonları useCallback ile sarmalayarak her render'da yeniden oluşturulmasını önlüyoruz
  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  return (
    <>
      <Navbar
        className="bg-gray-50 py-1"
        maxWidth="xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Hamburger menü butonu - sadece mobil görünümde */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden mr-1"
        />

        {/* Logo */}
        <NavbarBrand className="mr-0 sm:mr-4">
          <p className="font-bold text-inherit text-lg">Fin AI</p>
        </NavbarBrand>

        {/* Ana Navigasyon Bağlantıları - tablet ve desktop */}
        <NavbarContent className="hidden lg:flex gap-3 xl:gap-4 flex-1 justify-start">
          {navbarLinks.map((item, index) => (
            <NavbarItem key={index} className="h-full flex items-center">
              <button
                onClick={() => handleNavigate(item.path)}
                className="hover:text-primary text-sm xl:text-base px-2"
              >
                {item.name}
              </button>
            </NavbarItem>
          ))}

          <Dropdown>
            <DropdownTrigger color="secondary">
              <Button
                variant="flat"
                className="text-gray-900 text-sm hover:text-secondary h-full"
                endContent={
                  <Icon icon="material-symbols:arrow-drop-down" width="20" />
                }
              >
                Ekonomi & Finans
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Kategoriler" color="primary">
              {categories.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        {/* Ara butonu ve kullanıcı işlemleri */}
        <NavbarContent justify="end" className="gap-2">
          <NavbarItem>
            <Button
              variant="bordered"
              color="secondary"
              radius="lg"
              startContent={<Icon icon="material-symbols:search" width="14" />}
              size="sm"
              onClick={handleSearchOpen}
              className="min-w-0 px-2 sm:px-3"
            >
              <span className="hidden sm:block">Ara</span>
            </Button>
          </NavbarItem>

          {/* Eğer kullanıcı giriş yapmışsa profil ve çıkış butonu */}
          {isLoggedIn ? (
            <>
              {/* Sadece admin ve author rollerine sahip kullanıcılar için profil butonu göster */}
              {canAccessProfile && (
                <NavbarItem className="hidden lg:flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    startContent={<Icon icon="ic:round-person" width="16" />}
                    onClick={() => navigate("/profile")}
                    className="text-xs xl:text-sm min-w-0 px-2"
                  >
                    <span className="hidden xl:block">{userName}</span>
                  </Button>
                </NavbarItem>
              )}

              {/* Tüm giriş yapmış kullanıcılar için çıkış butonu */}
              <NavbarItem className="hidden lg:flex">
                <LogoutComponent />
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem className="hidden lg:flex">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="text-[14px] px-2 hover:text-primary"
                >
                  Login
                </button>
              </NavbarItem>

              <NavbarItem className="hidden lg:flex">
                <button
                  onClick={() => handleNavigate("/register")}
                  className="text-[14px] px-2 hover:text-primary"
                >
                  Register
                </button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* Mobil ve tablet menü */}
        <NavbarMenu className="pt-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navbarLinks.map((item, index) => (
              <NavbarMenuItem key={index}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className="w-full text-left py-2 hover:text-primary"
                >
                  {item.name}
                </button>
              </NavbarMenuItem>
            ))}

            <NavbarMenuItem>
              <div className="py-2">
                <p className="font-semibold mb-2">Ekonomi & Finans</p>
                <div className="flex flex-col gap-1 pl-2">
                  {categories.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full text-left py-1 hover:text-primary"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </NavbarMenuItem>

            {isLoggedIn ? (
              <>
                {canAccessProfile && (
                  <NavbarMenuItem>
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="w-full text-left py-2 hover:text-primary"
                    >
                      Profil ({userName})
                    </button>
                  </NavbarMenuItem>
                )}
                <NavbarMenuItem>
                  <LogoutComponent />
                </NavbarMenuItem>
              </>
            ) : (
              <>
                <NavbarMenuItem>
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="w-full text-left py-2 hover:text-primary"
                  >
                    Login
                  </button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <button
                    onClick={() => handleNavigate("/register")}
                    className="w-full text-left py-2 hover:text-primary"
                  >
                    Register
                  </button>
                </NavbarMenuItem>
              </>
            )}
          </div>
        </NavbarMenu>
      </Navbar>

      <SearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
}

// React.memo ile bileşeni sarmalayarak, props değişmediğinde
// gereksiz render'ları önlüyoruz
export default memo(CustomNavbar);
