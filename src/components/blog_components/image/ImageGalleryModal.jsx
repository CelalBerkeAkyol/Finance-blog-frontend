// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
} from "../../../app/features/image/imageGallerySlice";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import ImageUploaderModal from "./ImageUploaderModal";

const ImageGalleryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  // Bir resmi tıklayınca ID’sini burada tutacağız:
  const [selectedImageId, setSelectedImageId] = useState(null);

  // Kopyalama bildirimi gösterip kapatmak için
  const [copyNotification, setCopyNotification] = useState(false);

  // Modal içinde "Görsel Ekle" diyince uploaderModal açılsın
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Modal açıldığında ilk sayfayı çek
      dispatch(fetchImages({ page: 1, limit: 9 }));
    }
  }, [isOpen, dispatch]);

  // Görseli tıklayınca seçiyoruz (artık otomatik kopyalama yok)
  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  // Seçili görselin linkini kopyala
  const handleCopy = () => {
    if (!selectedImageId) {
      alert("Lütfen önce bir görsel seçin.");
      return;
    }
    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) return;

    const markdownLink = `![Resim Açıklaması](${foundImage.url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        setCopyNotification(true);
        setTimeout(() => {
          setCopyNotification(false);
        }, 2000);
      })
      .catch((err) => console.error("Kopyalama hatası:", err));
  };

  // Seçili görseli sil
  const handleDelete = () => {
    if (!selectedImageId) {
      alert("Lütfen silmek için bir görsel seçin.");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) {
      return;
    }
    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then(() => {
        // Silme tamamlandıktan sonra tekrar listeyi çek
        dispatch(fetchImages({ page, limit: 9 }));
        // Seçimi kaldır
        setSelectedImageId(null);
      })
      .catch((err) => console.error("Silme hatası:", err));
  };

  // Sayfaları değiştirmek için
  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(fetchImages({ page: page + 1, limit: 9 }));
      setSelectedImageId(null);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(fetchImages({ page: page - 1, limit: 9 }));
      setSelectedImageId(null);
    }
  };

  // Listeyi yenile (ilk sayfaya dön)
  const handleReload = () => {
    dispatch(fetchImages({ page: 1, limit: 9 }));
    setSelectedImageId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Modal Kutusu */}
        <div className="bg-white p-6 rounded max-w-6xl w-full">
          {/* Üst Kısım */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Görseller</h2>
            <div className="flex items-center space-x-2">
              {/* Yeniden Yükle */}
              <Button
                variant="flat"
                color="default"
                radius="md"
                startContent={<Icon icon="material-symbols:refresh" />}
                onPress={handleReload}
              >
                Yeniden Yükle
              </Button>

              {/* Görsel Ekle */}
              <Button
                variant="flat"
                color="primary"
                radius="md"
                onPress={() => setIsUploaderOpen(true)}
              >
                Görsel Ekle
              </Button>

              {/* Kapat */}
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
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => {
              const isSelected = image._id === selectedImageId;
              return (
                <div
                  key={image._id}
                  className={`border p-2 cursor-pointer ${
                    isSelected ? "border-blue-500" : "border-gray-200"
                  } hover:shadow-md`}
                  onClick={() => handleSelectImage(image._id)}
                >
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-40 object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Altta Butonlar (Kopyala, Sil, Sayfa Kontrolleri) */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            {/* Kopyala / Sil Butonları */}
            <div className="flex gap-2">
              <Button
                variant="flat"
                color="default"
                radius="md"
                onPress={handleCopy}
              >
                Kopyala
              </Button>
              <Button
                variant="flat"
                color="danger"
                radius="md"
                onPress={handleDelete}
              >
                Sil
              </Button>
            </div>

            {/* Sayfalama */}
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

          {/* Kopyalama Bildirimi */}
          {copyNotification && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
              Görsel linki markdown formatında kopyalandı!
            </div>
          )}
        </div>
      </div>

      {/* Görsel Yükleme Modalı */}
      {isUploaderOpen && (
        <ImageUploaderModal onClose={() => setIsUploaderOpen(false)} />
      )}
    </>
  );
};

export default ImageGalleryModal;
