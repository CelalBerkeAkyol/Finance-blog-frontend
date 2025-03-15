// src/app/components/ImageUploaderModal.jsx
import React from "react";
import ImageUploader from "./ImageUploader"; // ImageUploader'ın doğru yolu
import { useDispatch } from "react-redux";
import { fetchImages } from "../../../app/features/image/imageGallerySlice";
import { Button } from "@nextui-org/react";

const ImageUploaderModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();

  // Upload başarılı olursa gallery'deki görselleri yenile ve modalı kapat.
  const handleUploadSuccess = () => {
    dispatch(fetchImages({ page: 1, limit: 20 }));

    // onSuccess prop'u varsa çağır
    if (onSuccess && typeof onSuccess === "function") {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded max-w-2xl w-full relative">
        {/* NextUI Button ile kapatma butonu */}
        <Button
          auto
          color="error"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          Kapat
        </Button>
        <h2 className="text-2xl font-bold mb-4">Görsel Yükle</h2>
        {/* ImageUploader bileşenine onUploadSuccess callback'unu geçiriyoruz */}
        <ImageUploader onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default ImageUploaderModal;
