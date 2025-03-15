import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../app/features/user/userSlice";
import { logDebug, logError } from "../utils/logger";

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

  // Rol kontrolü başarısızsa erişim reddedildi sayfasına yönlendir
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Erişim Reddedildi!</strong>
          <p className="block sm:inline">
            {" "}
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <p className="mt-2">
            Bu sayfaya erişmek için gerekli yetkilere sahip değilsiniz.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tüm kontroller başarılıysa içeriği göster
  return children;
}

export default ProtectedRoute;
