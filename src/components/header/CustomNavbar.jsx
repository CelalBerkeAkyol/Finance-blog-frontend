import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logoutUser } from "../../app/features/user/userSlice"; // logoutUser ekleniyor

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
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  // Navbar ilk yüklendiğinde fetchUser çağrılıyor.
  useEffect(() => {
    console.log("Navbar yüklenirken fetchUser çağrılıyor...");
    dispatch(fetchUser());
  }, [dispatch]);

  // Logout işlemini gerçekleştiren fonksiyon
  const handleLogoutClick = () => {
    console.log("Logout işlemi başlatılıyor...");
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log("Logout başarılı, yönlendiriliyor...");
        window.location.href = "/blog-admin/login";
      })
      .catch((error) => {
        console.error("Logout sırasında hata oluştu:", error);
      });
  };

  return (
    <Navbar className="bg-zinc-50">
      {" "}
      {/* Arka plan rengi burada güncellendi */}
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/blog/posts/">Blogs</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* Kullanıcı giriş yapmamışsa Login ve Sign Up göster */}
        {!isLoggedIn ? (
          <>
            <NavbarItem>
              <Button as={Link} color="primary" to="/signup" variant="flat">
                Mail Bültenimize Katıl
              </Button>
            </NavbarItem>
          </>
        ) : (
          /* Kullanıcı giriş yapmışsa, Profil ve Çıkış Yap linklerini göster */
          <>
            <NavbarItem>
              <Link to="/profile">Profil</Link>
            </NavbarItem>
            <NavbarItem>
              <Button onClick={handleLogoutClick}>Çıkış Yap</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
