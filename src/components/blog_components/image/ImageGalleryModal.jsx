// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../../../app/features/image/imageGallerySlice";

// NextUI ve Iconify
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

// Sizin oluşturduğunuz veya import ettiğiniz modal
import ImageUploaderModal from "./ImageUploaderModal";

const ImageGalleryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );
  const [copyNotification, setCopyNotification] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchImages(1));
    }
  }, [isOpen, dispatch]);

  const handleImageClick = (url) => {
    const markdownLink = `![Resim Açıklaması](${url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        setCopyNotification(true);
        setTimeout(() => {
          setCopyNotification(false);
        }, 2000);
      })
      .catch((err) => console.error("Link kopyalanamadı:", err));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(fetchImages(page + 1));
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(fetchImages(page - 1));
    }
  };

  const handleReload = () => {
    dispatch(fetchImages(1));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Arka plan karartma */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Modal kutusu */}
        <div className="bg-white p-6 rounded max-w-6xl w-full">
          {/* Üst kısım: Başlık ve butonlar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Görseller</h2>
            <div className="flex items-center space-x-2">
              {/* Yeniden yükle butonu (reload ikonu ile) */}
              <Button
                variant="flat"
                color="default"
                radius="md"
                startContent={<Icon icon="material-symbols:refresh" />}
                onPress={handleReload}
              >
                Yeniden Yükle
              </Button>

              {/* Görsel ekle butonu: Artık yeşil değil, flat ve primary renk ayarı */}
              <Button
                variant="flat"
                color="primary"
                radius="md"
                onPress={() => setIsUploaderOpen(true)}
              >
                Görsel Ekle
              </Button>

              {/* Kapat butonu: danger renk (kırmızı ton), flat */}
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

          {/* Görsel galeri (grid) */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="border p-2 cursor-pointer hover:shadow-xl"
                onClick={() => handleImageClick(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.altText}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Sayfalama alanı */}
          <div className="flex justify-between items-center mt-6">
            {/* Önceki butonu: radius ve flat default renk */}
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

            {/* Sonraki butonu: radius ve flat default renk */}
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

          {/* Kopyalama bildirimi */}
          {copyNotification && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
              Görsel linki markdown formatında kopyalandı!
            </div>
          )}
        </div>
      </div>

      {/* Görsel yükleme modalı */}
      {isUploaderOpen && (
        <ImageUploaderModal onClose={() => setIsUploaderOpen(false)} />
      )}
    </>
  );
};

export default ImageGalleryModal;
