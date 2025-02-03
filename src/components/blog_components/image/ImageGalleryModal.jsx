// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../../../app/features/image/imageGallerySlice";
import ImageUploaderModal from "./ImageUploaderModal"; // Aşağıda tanımlanacak

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
        }, 2000); // 2 saniye sonra bildirim otomatik kapanır
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded max-w-6xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Görseller</h2>
            <div>
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="mr-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Görsel Ekle
              </button>
              <button onClick={onClose} className="text-red-500">
                Kapat
              </button>
            </div>
          </div>
          {loading && <p>Yükleniyor...</p>}
          {error && <p className="text-red-500">{error}</p>}
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
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="px-3 py-1 border rounded"
            >
              Önceki
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded"
            >
              Sonraki
            </button>
          </div>

          {copyNotification && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
              Görsel linki markdown formatında kopyalandı!
            </div>
          )}
        </div>
      </div>
      {isUploaderOpen && (
        <ImageUploaderModal onClose={() => setIsUploaderOpen(false)} />
      )}
    </>
  );
};

export default ImageGalleryModal;
