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
      if (userInfo) {
        setIsValid(true); // Kullanıcı hali hazırda varsa, direkt geç
        console.log("Protected Route: ", userInfo);
        return;
      }
      try {
        await dispatch(fetchUser()).unwrap();
        setIsValid(true);
      } catch (error) {
        console.error("Doğrulama hatası:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [dispatch, userInfo]);

  if (isValid === null) return <p>Loading...</p>;

  return isValid ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
