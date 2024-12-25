// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom"; // React Router'dan yönlendirme için kullanılır

function ProtectedRoute({ children }) {
  // LocalStorage'dan token kontrolü
  const token = localStorage.getItem("authToken");

  // Eğer token yoksa kullanıcı login sayfasına yönlendirilir
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
