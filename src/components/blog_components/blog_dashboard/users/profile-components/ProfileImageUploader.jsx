import React from "react";
import { Avatar, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

// Profil resmi yükleme bileşeni
const ProfileImageUploader = ({
  imagePreview,
  selectedImage,
  uploadingImage,
  fileInputRef,
  userInfo,
  onImageChange,
  onImageClick,
  onImageRemove,
}) => (
  <div className="flex flex-col items-center gap-4 mb-6 p-4 border border-dashed rounded-xl">
    <div className="flex justify-center">
      {imagePreview ? (
        <Avatar src={imagePreview} size="xl" isBordered className="w-32 h-32" />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
          <Icon icon="mdi:account" className="w-16 h-16 text-gray-400" />
        </div>
      )}
    </div>

    <input
      type="file"
      ref={fileInputRef}
      accept="image/jpeg,image/png,image/webp"
      onChange={onImageChange}
      className="hidden"
    />

    <div className="flex gap-2">
      <Button
        color="primary"
        onClick={onImageClick}
        startContent={<Icon icon="mdi:camera" />}
        isLoading={uploadingImage}
        isDisabled={uploadingImage}
      >
        {selectedImage ? "Resmi Değiştir" : "Resim Seç"}
      </Button>

      {selectedImage && (
        <Button
          color="danger"
          variant="light"
          onClick={onImageRemove}
          startContent={<Icon icon="mdi:close" />}
          isDisabled={uploadingImage}
        >
          Kaldır
        </Button>
      )}
    </div>

    <p className="text-xs text-gray-500">
      Desteklenen formatlar: JPEG, PNG, WEBP. Maksimum dosya boyutu: 5MB
    </p>
  </div>
);

export default ProfileImageUploader;
