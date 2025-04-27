import React from "react";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

export default function PageNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/pexels-googledeepmind-17483874.jpg')" }}
    >
      <BannerComponent />
      <CustomNavbar />
      <div className="flex-grow flex flex-col items-start justify-center py-12 px-4">
        {/* Finans ve AI temalı 404 içeriği */}
        <div className="text-center max-w-2xl text-black">
          {/* Basit bir AI/Finans görseli */}
          <div className="mb-8 relative mx-auto w-64 h-64">
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full opacity-20"></div>
            <div className="absolute inset-4 border-4 border-indigo-500 rounded-full opacity-30"></div>
            <div className="absolute inset-8 border-4 border-purple-500 rounded-full opacity-40"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold">
              404
            </div>
          </div>

          {/* Finans & AI temalı mesaj */}
          <h1 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h1>
          <p className="text-lg mb-6">
            Üzgünüz, aradığınız sayfayı bulamadık. Link değişmiş veya içerik
            kaldırılmış olabilir
          </p>

          {/* Eylem düğmesi */}
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-gradient-to-r from-sky-800 to-lime-800 text-white font-medium rounded-lg  "
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}
