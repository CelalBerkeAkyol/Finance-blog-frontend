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

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [copyNotification, setCopyNotification] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // İlk yükelemede 20 görseli çek
  useEffect(() => {
    dispatch(fetchImages({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Bir görseli seçme
  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  // Kopyalama
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

  // Silme
  const handleDelete = () => {
    if (!selectedImageId) {
      alert("Lütfen silmek için bir görsel seçin.");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then(() => {
        // Silme sonrası mevcut sayfadaki görselleri yenile
        dispatch(fetchImages({ page, limit: 20 }));
        setSelectedImageId(null);
      })
      .catch((err) => console.error("Silme hatası:", err));
  };

  // Sayfalama
  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(fetchImages({ page: page - 1, limit: 20 }));
      setSelectedImageId(null);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(fetchImages({ page: page + 1, limit: 20 }));
      setSelectedImageId(null);
    }
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: 1, limit: 20 }));
    setSelectedImageId(null);
  };

  // "Görsel Ekle" butonu: modal aç
  const handleAddImage = () => {
    setIsUploaderOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar solda sabit */}

      <BlogSidebarComponent />

      {/* İçerik */}
      <div className="flex-1 p-4 md:p-6">
        {/* Üst Butonlar */}
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

          <Button variant="flat" color="primary" onPress={handleAddImage}>
            Görsel Ekle
          </Button>
        </div>

        {/* İçerik */}
        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Responsive Grid: Küçük ekran = 2 sütun, orta = 3, büyük = 4, daha büyük = 5 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => {
            const isSelected = selectedImageId === img._id;
            return (
              <div
                key={img._id}
                onClick={() => handleSelectImage(img._id)}
                className={`cursor-pointer border p-1 ${
                  isSelected ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || "Görsel"}
                  className="w-full h-36 object-cover"
                  /* h-36 daha küçük görüntü */
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
