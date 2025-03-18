import React from "react";
import NotFoundErrorComponent from "../../components/uyarılar/NotFoundErrorComponent";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <BannerComponent />
      <CustomNavbar />
      <div className="flex-grow flex items-center justify-center py-12">
        <NotFoundErrorComponent message="Üzgünüz, aradığınız sayfa bulunamadı." />
      </div>
    </div>
  );
}
