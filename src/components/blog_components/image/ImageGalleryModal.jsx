// src/app/components/ImageGalleryModal.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../../../app/features/image/imageGallerySlice";

const ImageGalleryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  // Modal açıldığında ilk sayfayı getiriyoruz
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchImages(1));
    }
  }, [isOpen, dispatch]);

  // Görsele tıklanınca URL'yi kopyala
  const handleImageClick = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Görsel linki kopyalandı!"))
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Görseller</h2>
          <button onClick={onClose} className="text-red-500">
            Kapat
          </button>
        </div>
        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="border p-1 cursor-pointer hover:shadow-lg"
              onClick={() => handleImageClick(image.url)}
            >
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-auto"
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
      </div>
    </div>
  );
};

export default ImageGalleryModal;
