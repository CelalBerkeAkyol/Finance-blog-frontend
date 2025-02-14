import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
} from "../../app/features/image/imageGallerySlice";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ImageUploaderModal from "../../components/blog_components/image/ImageUploaderModal";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
function GalleryPage() {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  // Seçili görsel ID
  const [selectedImageId, setSelectedImageId] = useState(null);
  // Kopyalama bildirimi
  const [copyNotification, setCopyNotification] = useState(false);
  // Modal açık/kapalı state’i
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    // 12 görseli çekmek için
    dispatch(fetchImages({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  const handleCopy = () => {
    if (!selectedImageId) {
      alert("Lütfen bir görsel seçin.");
      return;
    }
    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) return;

    const markdownLink = `![Resim Açıklaması](${foundImage.url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        setCopyNotification(true);
        setTimeout(() => setCopyNotification(false), 2000);
      })
      .catch((err) => console.error("Kopyalama hatası:", err));
  };

  const handleDelete = () => {
    if (!selectedImageId) {
      alert("Lütfen silmek için bir görsel seçin.");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then(() => {
        dispatch(fetchImages({ page, limit: 12 }));
        setSelectedImageId(null);
      })
      .catch((err) => console.error("Silme hatası:", err));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(fetchImages({ page: page - 1, limit: 12 }));
      setSelectedImageId(null);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(fetchImages({ page: page + 1, limit: 12 }));
      setSelectedImageId(null);
    }
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: 1, limit: 12 }));
    setSelectedImageId(null);
  };

  // "Görsel Ekle" butonuna tıklayınca modalı aç
  const handleAddImage = () => {
    setIsUploaderOpen(true);
  };

  return (
    <div className="flex flex-1">
      <BlogSidebarComponent />
      <div className="min-h-screen p-6">
        {/* Butonlar */}
        <div className="mb-4 flex flex-wrap gap-2 justify-end">
          <Button
            variant="flat"
            color="default"
            startContent={<Icon icon="material-symbols:refresh" />}
            onPress={handleReload}
          >
            Yeniden Yükle
          </Button>

          <Button variant="flat" color="default" onPress={handleCopy}>
            Kopyala
          </Button>

          <Button variant="flat" color="danger" onPress={handleDelete}>
            Sil
          </Button>

          {/* Görsel Ekle Butonu */}
          <Button variant="flat" color="primary" onPress={handleAddImage}>
            Görsel Ekle
          </Button>
        </div>

        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* 4 sütun x 3 satır = 12 görsel */}
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => {
            const isSelected = selectedImageId === img._id;
            return (
              <div
                key={img._id}
                onClick={() => handleSelectImage(img._id)}
                className={`border p-2 cursor-pointer ${
                  isSelected ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || "Görsel"}
                  className="w-full h-60 object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Sayfalama */}
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="flat"
            color="default"
            isDisabled={page <= 1}
            onPress={handlePrevPage}
          >
            Önceki
          </Button>
          <span>
            Sayfa: {page} / {totalPages}
          </span>
          <Button
            variant="flat"
            color="default"
            isDisabled={page >= totalPages}
            onPress={handleNextPage}
          >
            Sonraki
          </Button>
        </div>

        {/* Kopyalama bildirimi */}
        {copyNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Görsel linki kopyalandı!
          </div>
        )}

        {/* Yükleme Modalı */}
        {isUploaderOpen && (
          <ImageUploaderModal onClose={() => setIsUploaderOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
