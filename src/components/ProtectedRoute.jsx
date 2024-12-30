import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../app/features/user/userSlice";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await dispatch(fetchUser()).unwrap(); // Kullanıcıyı Redux state'e yükle
        setIsValid(response.valid);
      } catch (error) {
        console.error("Doğrulama hatası:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [dispatch]);

  if (isValid === null) return <p>Loading...</p>; // Doğrulama bekleniyor
  return isValid ? children : <Navigate to="/blog-admin/login" />;
}

export default ProtectedRoute;
