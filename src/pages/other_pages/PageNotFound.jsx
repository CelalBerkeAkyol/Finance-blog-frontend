import React from "react";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";
import ErrorComponent from "../../components/uyarılar/ErrorComponent";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <BannerComponent />
      <CustomNavbar />
      <div className="flex-grow flex items-center justify-center py-12">
        <ErrorComponent message="Üzgünüz, aradığınız sayfa bulunamadı." />
      </div>
    </div>
  );
}
