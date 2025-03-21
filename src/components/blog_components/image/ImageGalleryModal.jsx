// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
} from "../../../app/features/image/imageGallerySlice";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useFeedback } from "../../../context/FeedbackContext";
import ImageUploaderModal from "./ImageUploaderModal";

const ImageGalleryModal = ({ isOpen, onClose, onSelectImage }) => {
  const dispatch = useDispatch();
  const { success, error: showError, warning } = useFeedback();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchImages({ page: 1, limit: 15 }));
    }
  }, [isOpen, dispatch]);

  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  const handleCopy = () => {
    if (!selectedImageId) {
      warning("Lütfen önce bir görsel seçin.");
      return;
    }
    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) return;

    const markdownLink = `![Resim Açıklaması](${foundImage.url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        success("Görsel linki markdown formatında kopyalandı!");
      })
      .catch((err) => {
        console.error("Kopyalama hatası:", err);
        showError("Görsel linki kopyalanırken bir hata oluştu.");
      });
  };

  const handleDelete = () => {
    if (!selectedImageId) {
      warning("Lütfen silmek için bir görsel seçin.");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) {
      return;
    }
    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then(() => {
        dispatch(fetchImages({ page, limit: 15 }));
        setSelectedImageId(null);
        success("Görsel başarıyla silindi!");
      })
      .catch((err) => {
        console.error("Silme hatası:", err);
        showError("Görsel silinirken bir hata oluştu.");
      });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(fetchImages({ page: page + 1, limit: 15 }));
      setSelectedImageId(null);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(fetchImages({ page: page - 1, limit: 15 }));
      setSelectedImageId(null);
    }
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: 1, limit: 15 }));
    setSelectedImageId(null);
    success("Görseller yenilendi!");
  };

  const handleUseImage = () => {
    if (!selectedImageId) {
      warning("Lütfen önce bir görsel seçin.");
      return;
    }

    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) return;

    if (onSelectImage && typeof onSelectImage === "function") {
      onSelectImage(foundImage.url);
      success("Görsel başarıyla seçildi!");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Arka plan karartma */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Modal kutusu: yüksekliği %90 ve dikey scroll*/}
        <div className="bg-white rounded max-w-6xl w-full max-h-[100vh] overflow-y-auto flex flex-col p-6">
          {/* Üst Başlık ve Butonlar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Görseller</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="flat"
                color="default"
                radius="md"
                startContent={<Icon icon="material-symbols:refresh" />}
                onPress={handleReload}
              >
                Yeniden Yükle
              </Button>

              <Button
                variant="flat"
                color="primary"
                radius="md"
                onPress={() => setIsUploaderOpen(true)}
              >
                Görsel Ekle
              </Button>

              <Button
                variant="flat"
                color="danger"
                radius="md"
                onPress={onClose}
              >
                Kapat
              </Button>
            </div>
          </div>

          {/* İçerik alanı */}
          {loading && <p>Yükleniyor...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Görsel Galeri */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => {
              const isSelected = image._id === selectedImageId;
              return (
                <div
                  key={image._id}
                  className={`border p-2 cursor-pointer ${
                    isSelected ? "border-blue-500" : "border-gray-200"
                  } hover:shadow-md flex flex-col items-center`}
                  onClick={() => handleSelectImage(image._id)}
                >
                  <img
                    src={image.url}
                    alt={image.altText || "Görsel"}
                    className="w-full h-24 object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-700 text-center font-medium">
                    {image.filename || image.name || "İsimsiz Görsel"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Alt kısım: Butonlar ve Sayfalama */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            {/* Kopyala / Sil / Kullan Butonları */}
            <div className="flex gap-2">
              <Button
                variant="flat"
                color="default"
                radius="md"
                onPress={handleCopy}
              >
                Kopyala
              </Button>
              {onSelectImage && (
                <Button
                  variant="flat"
                  color="primary"
                  radius="md"
                  onPress={handleUseImage}
                >
                  Kullan
                </Button>
              )}
              <Button
                variant="flat"
                color="danger"
                radius="md"
                onPress={handleDelete}
              >
                Sil
              </Button>
            </div>

            {/* Sayfa kontrolü */}
            <div className="flex justify-between items-center w-full max-w-sm">
              <Button
                variant="flat"
                color="default"
                radius="md"
                isDisabled={page <= 1}
                onPress={handlePrevPage}
              >
                Önceki
              </Button>
              <span>
                {page} / {totalPages}
              </span>
              <Button
                variant="flat"
                color="default"
                radius="md"
                isDisabled={page >= totalPages}
                onPress={handleNextPage}
              >
                Sonraki
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Görsel yükleme modalı */}
      {isUploaderOpen && (
        <ImageUploaderModal
          onClose={() => setIsUploaderOpen(false)}
          onSuccess={() => {
            setIsUploaderOpen(false);
            success("Görsel başarıyla yüklendi!");
            dispatch(fetchImages({ page: 1, limit: 15 }));
          }}
        />
      )}
    </>
  );
};

export default ImageGalleryModal;
