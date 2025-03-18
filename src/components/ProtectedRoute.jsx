import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../app/features/user/userSlice";
import { logDebug, logError } from "../utils/logger";
import ErrorComponent from "./uyarılar/ErrorComponent";

/**
 * Korumalı route bileşeni
 * @param {Object} props
 * @param {React.ReactNode} props.children - Route içeriği
 * @param {Array<string>} [props.allowedRoles] - İzin verilen roller ['admin', 'author'] gibi. Belirtilmezse sadece giriş kontrolü yapılır.
 * @param {string} [props.redirectPath='/login'] - Erişim reddedildiğinde yönlendirilecek sayfa
 * @returns {React.ReactNode}
 */
function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectPath = "/login",
}) {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isLoggedIn, isAdmin, isAuthor } = useSelector(
    (state) => state.user
  );
  const [hasPermission, setHasPermission] = useState(null);

  // Kullanıcının rollerini kontrol et
  const checkUserRoles = () => {
    // Eğer rol kontrolü yapılmayacaksa (allowedRoles boşsa), sadece giriş kontrolü yeterli
    if (!allowedRoles || allowedRoles.length === 0) {
      setHasPermission(true);
      return;
    }

    // Kullanıcının rollerini kontrol et
    const hasRole = allowedRoles.some((role) => {
      if (role === "admin") return isAdmin;
      if (role === "author") return isAuthor;
      return false;
    });

    setHasPermission(hasRole);
  };

  useEffect(() => {
    // Kullanıcı bilgisi yoksa veya giriş yapılmamışsa, kullanıcı bilgisini getir
    if (!userInfo || !isLoggedIn) {
      dispatch(fetchUser())
        .then(() => {
          logDebug("ProtectedRoute", "Kullanıcı bilgisi güncellendi");
        })
        .catch((error) => {
          logError("ProtectedRoute", "Kullanıcı bilgisi alınamadı", error);
        });
    }
  }, [dispatch, userInfo, isLoggedIn]);

  // Kullanıcı bilgileri değiştiğinde rol kontrolü yap
  useEffect(() => {
    if (isLoggedIn) {
      checkUserRoles();
    } else {
      setHasPermission(false);
    }
  }, [isLoggedIn, isAdmin, isAuthor, allowedRoles]);

  // Yükleme durumunda bekle
  if (isLoading || hasPermission === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Yükleniyor...</span>
      </div>
    );
  }

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} />;
  }

  // Rol kontrolü başarısızsa erişim reddedildi hata sayfasını göster
  if (!hasPermission) {
    const neededRoles = allowedRoles.join(", ");
    return (
      <div className="h-screen flex items-center justify-center">
        <ErrorComponent
          type="auth"
          title="Erişim Reddedildi"
          message={`Bu sayfaya erişmek için gerekli yetkilere sahip değilsiniz. Gereken roller: ${neededRoles}`}
          actionText="Ana Sayfaya Dön"
          onAction={() => (window.location.href = "/")}
          color="warning"
        />
      </div>
    );
  }

  // Tüm kontroller başarılıysa içeriği göster
  return children;
}

export default ProtectedRoute;
