import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
  clearImageErrors,
} from "../../app/features/image/imageGallerySlice";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ImageUploaderModal from "../../components/blog_components/image/ImageUploaderModal";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import ErrorBoundary from "../../components/Error/ErrorBoundary";

function GalleryPage() {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // İlk yükelemede 20 görseli çek
  useEffect(() => {
    dispatch(fetchImages({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Bildirim gösterme fonksiyonu
  // To do -> bunu component haline getir
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Hata mesajı varsa bildirim göster
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
      // Hata mesajını gösterdikten sonra temizle
      setTimeout(() => {
        dispatch(clearImageErrors());
      }, 3000);
    }
  }, [error, dispatch]);

  // Bir görseli seçme
  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  // Kopyalama
  const handleCopy = () => {
    if (!selectedImageId) {
      showNotification("Lütfen bir görsel seçin.", "warning");
      return;
    }
    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) {
      showNotification("Seçilen görsel bulunamadı.", "error");
      return;
    }

    const markdownLink = `![Resim Açıklaması](${foundImage.url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        showNotification("Görsel linki kopyalandı!");
      })
      .catch((err) => {
        console.error("Kopyalama hatası:", err);
        showNotification("Kopyalama sırasında bir hata oluştu.", "error");
      });
  };

  // Silme
  const handleDelete = () => {
    if (!selectedImageId) {
      showNotification("Lütfen silmek için bir görsel seçin.", "warning");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then((result) => {
        setSelectedImageId(null);
        showNotification("Görsel başarıyla silindi.");
      })
      .catch((err) => {
        console.error("Silme hatası:", err);
        showNotification(
          err.message || "Görsel silinirken bir hata oluştu.",
          "error"
        );
      });
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
    showNotification("Görseller yenilendi.");
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
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Yükleniyor...</span>
          </div>
        )}

        {/* Responsive Grid: Küçük ekran = 2 sütun, orta = 3, büyük = 4, daha büyük = 5 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((img) => {
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Görsel+Yüklenemedi";
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Görüntülenecek görsel bulunamadı.</p>
            </div>
          )}
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

        {/* Bildirim */}
        {notification.show && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${
              notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Yükleme Modalı */}
        {isUploaderOpen && (
          <ImageUploaderModal
            onClose={() => setIsUploaderOpen(false)}
            onSuccess={() => {
              setIsUploaderOpen(false);
              showNotification("Görsel başarıyla yüklendi.");
              dispatch(fetchImages({ page: 1, limit: 20 }));
            }}
          />
        )}
      </div>
    </div>
  );
}

// Error Boundary ile sarmalayarak dışa aktarıyoruz
function GalleryPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <GalleryPage />
    </ErrorBoundary>
  );
}

export default GalleryPageWithErrorBoundary;
