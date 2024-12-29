import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api"; // Axios yapılandırması

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post("/auth/verify-token/", {
          withCredentials: true, // Cookie gönderimi için
        });
        setIsValid(response.data.valid);
      } catch (error) {
        setIsValid(false);
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return <p>Loading...</p>; // Doğrulama bekleniyor
  return isValid ? children : <Navigate to="/blog-admin/login" />;
}

export default ProtectedRoute;
