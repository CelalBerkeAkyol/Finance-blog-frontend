import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
  clearImageErrors,
} from "../../app/features/image/imageGallerySlice";
import { Button, Pagination } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ImageUploaderModal from "../../components/blog_components/image/ImageUploaderModal";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import ErrorBoundary from "../../components/Error/ErrorBoundary";
import { useFeedback } from "../../context/FeedbackContext";
import useScrollToTop from "../../hooks/useScrollToTop";
import { scrollToTop } from "../../utils/scrollHelpers";

// Görsel yüklenemediğinde kullanılacak fallback görsel (base64 encoded küçük gri resim)
const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFnUlEQVR4nO2db2gTWRTFzxddKYiySusPBUEEQdKVLi5SFNH1R10r+kFwqayCWEVBKf5ZP6kfBKVY0FoUwQ+CIq7Ioi0idF0pCkIRREGsokj9A0WKIl2EKrs0743pOm3idJJ5c+feOz8Y2k5JJ+e8d+6bmUlyAcMwDMMwDMMwDMMwDMMwDMMwDMMwDDBXw3JQJgArADwl+XspWcWYGzkFYILkWwCDAHpKyyfbSYkCcBDAO5JvAAwBWB0imGwkJQjAcQDfSb4zUvUDWBYwpmwgJQbAReXJ+mKSjgFYGyiqrCAlBMAl5cn6ocw6AGB+gMiS/hG0S56sn0zWKQCLK4+N/2vQTTZnnZ81p1JPAVjfVtfHGdJtSc7p9eN6jEo9DWBbe7sfR0g3+drYmO6I6LIGgIO17yL59P9OHJw/pT7GWfVVeZqG0VN+Q3myfqhRXZPfR7oB/NZw4+iRbvGlqf5OVbxTpSAU8KjRxlEk3V5r04IfqVLh40YbRpF0a7VGhT9TpVuOJtvmCOmGahMqfKZKcXmuGZPJplnSUGepONH0XrGmqQD0NmsUJdIvI9GKbKZSSR42axI10t1Zppp0QJOfqVJM9zdbGjXSXasVpmZTYXK80XaRI91UqazQR3eKcQINtooe6QtVK33tQgUAvPAhAOlCR/dQWu9DXw8CYB3J74ErfAGC/Aem/yXM3oGxCdKHvJnrTSQvfKEDuBpWKJ9CuS03YfG/GPdSIJO/SpmdOQBPTY7MK/I7QHqR/9r3/9NcaFxOeQELSJ5OzQlYOO9BIa2CRXrQvT9WU2Qo3eF0jEErYQEKIr0lOUx6I3gQoR2wdJ/3pLcUQrV1s2BFBMmrk8GaPBw41LCCa5XAArDdnTLOULAiAqusCpZxMnSoYQVXK4GF3EzoB3f6OAPBiggs5VVYWBc61LCCq12tBBamegoVt0cZCFZEYIVVwZrYFDrUsIKrPa0E1v9x9D0JrMYrJbDaV68EVvOVEljt61kqLsQjHwvNyoqJn2YsglUZsFIxxqG+6a1O4X75iVHZfcmLCUv/VYHznFPqT5IGbvqDkZMxzJM8a55g/eycmnuCsBVYb0g+Nx3SH5f830x7A2tCmUZOJK8pPzGqzYE1pUzzJpTvKE/WUQBLA0RSN1jB1KbGlD8hHlM3lSfrYwCLAkRRV1jB1KbGlJ/uP1X/kPzPzq3ZHyAKyxbGkn8BuEB5soZNqCsD9G/ZwtgadUP2hHIMwK4AvVu2ML781MQbyhN2CsD2AD1btrArOV/5Sfcbyre5XwKwJUCvli3sSj58xDxpZpQnrx/A5gB9tgWWmDWG5rAYrT6oMXnivgKwLkB/bYFV80mLdKFZ87IYz8AkH/5eAuBsgL5SgdW/y4P6CrM2ZXvGdJosbwtfAdgYoJ/UYPXv8oTMQ2VORpWfuD8ArA7QS9Ng9e/ynMxnZTPKE/gdwPIAfbQEVv8uj8oCCEaVJzAZ1+mwBFb/rhkrW6A8iUnDlTNmwerfNWNly5Qncch0Oj9AzZYtrIH0LuVJfAVgaYB6LVtYA2PQYuWJ/BPA4gC1WrawBtIrlCfyBYDuALVatrAGxqAFyhP5G4BFAeq0bGENpHcoT+QQgJ4AdVq2sAbPZlSuPJm/SoyWLQyoceXJfA5gboAaLVsYSG9TnswnALoCbG/ZwpAa9X+UJ/QRgDkBtrdsYUB5Mp8AmB1ga8sWtWlxQnkyHwPoVN7OsoVtb9tOeiKfsIYtbHvbdgPruPJkPpScpYYt7JzRtp2k+5Qn8wGAWQG2tGzRzi/BUp7QQQCdAbazbNGuH4VSntB7AGYECDMzwXrXhrCQ/iHYFWAbgFnKk3ofQPhADcMwDMMwDMMwDMMwDMMwDMMwDMMwoh/+AXhp5f7UDYp9AAAAAElFTkSuQmCC";

function GalleryPage() {
  const dispatch = useDispatch();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );
  const { showToast, success, error: showError, warning } = useFeedback();

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadErrors, setLoadErrors] = useState({});
  // Hata bildirimi gösterildi mi durumu
  const [errorNotified, setErrorNotified] = useState(false);

  // Page değiştiğinde sayfayı en üste kaydır
  useScrollToTop(currentPage, { behavior: "auto", delay: 100 });

  // İlk yükelemede 20 görseli çek
  useEffect(() => {
    dispatch(fetchImages({ page: currentPage, limit: 20 }));
    // Sayfa değiştiğinde hata durumlarını ve bildirim durumunu sıfırla
    setLoadErrors({});
    setErrorNotified(false);
  }, [dispatch, currentPage]);

  // Hata mesajı varsa bildirim göster
  useEffect(() => {
    if (error) {
      showError(error);
      // Hata mesajını gösterdikten sonra temizle
      setTimeout(() => {
        dispatch(clearImageErrors());
      }, 3000);
    }
  }, [error, dispatch, showError]);

  // Hata sayısı değiştikçe sadece bir kez bildirim göster
  useEffect(() => {
    const errorCount = Object.keys(loadErrors).length;

    if (errorCount > 0 && !errorNotified) {
      // Tek bir bildirim göster - sayı belirtmeden
      warning(
        "Bazı görseller yüklenemedi. Erişilemeyen görselleri seçip silebilirsiniz."
      );
      setErrorNotified(true);

      // Console log ile hata bilgisi
      console.warn("Bazı görseller yüklenemedi.");
    }
  }, [loadErrors, warning, errorNotified]);

  // Bir görseli seçme
  const handleSelectImage = (id) => {
    setSelectedImageId(id === selectedImageId ? null : id);
  };

  // Kopyalama
  const handleCopy = () => {
    if (!selectedImageId) {
      warning("Lütfen bir görsel seçin.");
      return;
    }
    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) {
      showError("Seçilen görsel bulunamadı.");
      return;
    }

    // Eğer görsel yüklenemedi hatası varsa uyarı ver
    if (loadErrors[foundImage._id]) {
      warning("Bu görsel erişilemez durumda. Kopyalama işlemi yapılamıyor.");
      return;
    }

    const markdownLink = `![Resim Açıklaması](${foundImage.url})`;
    navigator.clipboard
      .writeText(markdownLink)
      .then(() => {
        success("Görsel linki kopyalandı!");
      })
      .catch((err) => {
        console.error("Kopyalama hatası:", err);
        showError("Kopyalama sırasında bir hata oluştu.");
      });
  };

  // Silme
  const handleDelete = () => {
    if (!selectedImageId) {
      warning("Lütfen silmek için bir görsel seçin.");
      return;
    }
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    // Görsel zaten erişilemez durumdaysa, doğrudan veritabanından silme işlemi yap
    const isErrorImage = loadErrors[selectedImageId];

    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then((result) => {
        setSelectedImageId(null);
        // Hata listesinden görsel ID'sini sil
        setLoadErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[selectedImageId];
          return newErrors;
        });

        if (isErrorImage) {
          success("Erişilemeyen görsel veritabanından temizlendi!");
        } else {
          success("Görsel başarıyla silindi.");
        }

        dispatch(fetchImages({ page: currentPage, limit: 20 }));
      })
      .catch((err) => {
        console.error("Silme hatası:", err);
        showError(err.message || "Görsel silinirken bir hata oluştu.");
      });
  };

  // Sayfalama
  const handlePageChange = (newPage) => {
    // Önce sayfayı tam olarak en üste kaydır, sonra sayfa değişimini gerçekleştir
    scrollToTop({ behavior: "instant", delay: 0 });
    setCurrentPage(newPage);
    setSelectedImageId(null);
    setLoadErrors({}); // Sayfa değiştiğinde hataları sıfırla
    setErrorNotified(false); // Bildirim durumunu sıfırla
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: currentPage, limit: 20 }));
    setSelectedImageId(null);
    setLoadErrors({}); // Yeniden yüklerken hataları sıfırla
    setErrorNotified(false); // Bildirim durumunu sıfırla
    success("Görseller yenilendi.");
  };

  // "Görsel Ekle" butonu: modal aç
  const handleAddImage = () => {
    setIsUploaderOpen(true);
  };

  // Görsel yüklenme hatası durumunda
  const handleImageError = (imageId, e) => {
    // Zaten onerror null yapıldıysa bir daha çalıştırma
    if (!e.target.getAttribute("data-error-handled")) {
      // Hatayı işaretleme
      e.target.setAttribute("data-error-handled", "true");
      e.target.onerror = null;

      // Fallback görsel ayarlama
      e.target.src = FALLBACK_IMAGE;

      // Hata durumunu state'e kaydetme (bildirim göstermeden)
      setLoadErrors((prev) => ({
        ...prev,
        [imageId]: true,
      }));
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar solda sabit */}
      <BlogSidebarComponent />

      {/* İçerik */}
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
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
              const hasError = loadErrors[img._id];

              return (
                <div
                  key={img._id}
                  onClick={() => handleSelectImage(img._id)}
                  className={`cursor-pointer border p-1 ${
                    isSelected ? "border-blue-500" : "border-gray-200"
                  } ${
                    hasError ? "bg-red-50" : ""
                  } hover:border-blue-300 transition-colors`}
                >
                  <div className="relative w-full h-36">
                    <img
                      src={img.url}
                      alt={img.altText || "Görsel"}
                      className={`w-full h-full object-cover ${
                        hasError ? "opacity-40" : ""
                      }`}
                      data-image-id={img._id}
                      onError={(e) => handleImageError(img._id, e)}
                    />
                    {hasError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Erişilemiyor (Silinmeli)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Görüntülenecek görsel bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Sayfalama - NextUI Pagination kullanarak */}
        <div className="mt-6 flex justify-center flex-col items-center gap-2">
          <Pagination
            total={totalPages || 1}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showControls
            classNames={{
              wrapper: "gap-0 overflow-visible",
            }}
          />
        </div>

        {/* Yükleme Modalı */}
        {isUploaderOpen && (
          <ImageUploaderModal
            onClose={() => setIsUploaderOpen(false)}
            onSuccess={() => {
              setIsUploaderOpen(false);
              success("Görsel başarıyla yüklendi.");
              // Görsel eklendikten sonra ilk sayfaya dön ve yenile
              setCurrentPage(1);
              setLoadErrors({}); // Hataları sıfırla
              setErrorNotified(false); // Bildirim durumunu sıfırla
              dispatch(fetchImages({ page: 1, limit: 20 }));
            }}
          />
        )}
      </div>
    </div>
  );
}

// Hata sınırı ile sarmak
function GalleryPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <GalleryPage />
    </ErrorBoundary>
  );
}

export default GalleryPageWithErrorBoundary;
