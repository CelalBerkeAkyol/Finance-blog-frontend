import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../app/features/user/userSlice";
import { Spinner } from "@nextui-org/react";

function ProtectedRoute({ children, requiredRoles = [] }) {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      if (userInfo) {
        // Kullanıcı hali hazırda varsa, rol kontrolü yap
        if (requiredRoles.length > 0) {
          // Belirli roller gerekiyorsa, kullanıcının rolünü kontrol et
          const hasRequiredRole = requiredRoles.includes(userInfo.role);
          setIsValid(hasRequiredRole);

          if (!hasRequiredRole) {
            console.warn(
              `Yetkisiz erişim girişimi: ${location.pathname} - Kullanıcı: ${userInfo.userName}, Rol: ${userInfo.role}`
            );
          }
        } else {
          // Herhangi bir rol gerekli değilse, sadece giriş yapmış olması yeterli
          setIsValid(true);
        }
        console.log("Protected Route: ", userInfo);
        return;
      }

      try {
        const result = await dispatch(fetchUser()).unwrap();

        // Token doğrulandıktan sonra rol kontrolü yap
        if (requiredRoles.length > 0 && result.user) {
          const hasRequiredRole = requiredRoles.includes(result.user.role);
          setIsValid(hasRequiredRole);

          if (!hasRequiredRole) {
            console.warn(
              `Yetkisiz erişim girişimi: ${location.pathname} - Kullanıcı: ${result.user.userName}, Rol: ${result.user.role}`
            );
          }
        } else {
          setIsValid(result.valid);
        }
      } catch (error) {
        console.error("Doğrulama hatası:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [dispatch, userInfo, requiredRoles, location.pathname]);

  if (isValid === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Yetki kontrol ediliyor..." />
      </div>
    );
  }

  // Kullanıcı giriş yapmış ama gerekli role sahip değilse ana sayfaya yönlendir
  if (isValid === false && userInfo) {
    return <Navigate to="/" replace />;
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  return isValid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
