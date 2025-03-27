// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
} from "../../../app/features/image/imageGallerySlice";
import { Button, Pagination } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useFeedback } from "../../../context/FeedbackContext";
import ImageUploaderModal from "./ImageUploaderModal";
import { scrollToTop } from "../../../utils/scrollHelpers";

// Görsel yüklenemediğinde kullanılacak fallback görsel (base64 encoded küçük gri resim)
const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFnUlEQVR4nO2db2gTWRTFzxddKYiySusPBUEEQdKVLi5SFNH1R10r+kFwqayCWEVBKf5ZP6kfBKVY0FoUwQ+CIq7Ioi0idF0pCkIRREGsokj9A0WKIl2EKrs0743pOm3idJJ5c+feOz8Y2k5JJ+e8d+6bmUlyAcMwDMMwDMMwDMMwDMMwDMMwDMMwDDBXw3JQJgArADwl+XspWcWYGzkFYILkWwCDAHpKyyfbSYkCcBDAO5JvAAwBWB0imGwkJQjAcQDfSb4zUvUDWBYwpmwgJQbAReXJ+mKSjgFYGyiqrCAlBMAl5cn6ocw6AGB+gMiS/hG0S56sn0zWKQCLK4+N/2vQTTZnnZ81p1JPAVjfVtfHGdJtSc7p9eN6jEo9DWBbe7sfR0g3+drYmO6I6LIGgIO17yL59P9OHJw/pT7GWfVVeZqG0VN+Q3myfqhRXZPfR7oB/NZw4+iRbvGlqf5OVbxTpSAU8KjRxlEk3V5r04IfqVLh40YbRpF0a7VGhT9TpVuOJtvmCOmGahMqfKZKcXmuGZPJplnSUGepONH0XrGmqQD0NmsUJdIvI9GKbKZSSR42axI10t1Zppp0QJOfqVJM9zdbGjXSXasVpmZTYXK80XaRI91UqazQR3eKcQINtooe6QtVK33tQgUAvPAhAOlCR/dQWu9DXw8CYB3J74ErfAGC/Aem/yXM3oGxCdKHvJnrTSQvfKEDuBpWKJ9CuS03YfG/GPdSIJO/SpmdOQBPTY7MK/I7QHqR/9r3/9NcaFxOeQELSJ5OzQlYOO9BIa2CRXrQvT9WU2Qo3eF0jEErYQEKIr0lOUx6I3gQoR2wdJ/3pLcUQrV1s2BFBMmrk8GaPBw41LCCa5XAArDdnTLOULAiAqusCpZxMnSoYQVXK4GF3EzoB3f6OAPBiggs5VVYWBc61LCCq12tBBamegoVt0cZCFZEYIVVwZrYFDrUsIKrPa0E1v9x9D0JrMYrJbDaV68EVvOVEljt61kqLsQjHwvNyoqJn2YsglUZsFIxxqG+6a1O4X75iVHZfcmLCUv/VYHznFPqT5IGbvqDkZMxzJM8a55g/eycmnuCsBVYb0g+Nx3SH5f830x7A2tCmUZOJK8pPzGqzYE1pUzzJpTvKE/WUQBLA0RSN1jB1KbGlD8hHlM3lSfrYwCLAkRRV1jB1KbGlJ/uP1X/kPzPzq3ZHyAKyxbGkn8BuEB5soZNqCsD9G/ZwtgadUP2hHIMwK4AvVu2ML781MQbyhN2CsD2AD1btrArOV/5Sfcbyre5XwKwJUCvli3sSj58xDxpZpQnrx/A5gB9tgWWmDWG5rAYrT6oMXnivgKwLkB/bYFV80mLdKFZ87IYz8AkH/5eAuBsgL5SgdW/y4P6CrM2ZXvGdJosbwtfAdgYoJ/UYPXv8oTMQ2VORpWfuD8ArA7QS9Ng9e/ynMxnZTPKE/gdwPIAfbQEVv8uj8oCCEaVJzAZ1+mwBFb/rhkrW6A8iUnDlTNmwerfNWNly5Qncch0Oj9AzZYtrIH0LuVJfAVgaYB6LVtYA2PQYuWJ/BPA4gC1WrawBtIrlCfyBYDuALVatrAGxqAFyhP5G4BFAeq0bGENpHcoT+QQgJ4AdVq2sAbPZlSuPJm/SoyWLQyoceXJfA5gboAaLVsYSG9TnswnALoCbG/ZwpAa9X+UJ/QRgDkBtrdsYUB5Mp8AmB1ga8sWtWlxQnkyHwPoVN7OsoVtb9tOeiKfsIYtbHvbdgPruPJkPpScpYYt7JzRtp2k+5Qn8wGAWQG2tGzRzi/BUp7QQQCdAbazbNGuH4VSntB7AGYECDMzwXrXhrCQ/iHYFWAbgFnKk3ofQPhADcMwDMMwDMMwDMMwDMMwDMMwDMMwoh/+AXhp5f7UDYp9AAAAAElFTkSuQmCC";

const ImageGalleryModal = ({ isOpen, onClose, onSelectImage }) => {
  const dispatch = useDispatch();
  const { success, error: showError, warning } = useFeedback();
  const { images, loading, error, page, totalPages } = useSelector(
    (state) => state.imageGallery
  );

  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadErrors, setLoadErrors] = useState({});
  // Hata bildirimi gösterildi mi durumu
  const [errorNotified, setErrorNotified] = useState(false);

  // Modal içeriğini en üste kaydırmak için ref kullanımı
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchImages({ page: currentPage, limit: 20 }));
      // Sayfa değiştiğinde hata durumlarını ve bildirim durumunu sıfırla
      setLoadErrors({});
      setErrorNotified(false);
    }
  }, [isOpen, dispatch, currentPage]);

  // Modal açıldığında sayfa 1'e resetle
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setLoadErrors({});
      setErrorNotified(false);
    }
  }, [isOpen]);

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

    // Eğer görsel yüklenemedi hatası varsa uyarı ver
    if (loadErrors[foundImage._id]) {
      warning("Bu görsel erişilemez durumda. Kopyalama işlemi yapılamıyor.");
      return;
    }

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

    // Görsel zaten erişilemez durumdaysa, doğrudan veritabanından silme işlemi yap
    const isErrorImage = loadErrors[selectedImageId];

    dispatch(deleteImage(selectedImageId))
      .unwrap()
      .then(() => {
        dispatch(fetchImages({ page: currentPage, limit: 20 }));
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
          success("Görsel başarıyla silindi!");
        }
      })
      .catch((err) => {
        console.error("Silme hatası:", err);
        showError("Görsel silinirken bir hata oluştu.");
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedImageId(null);
    setLoadErrors({});
    setErrorNotified(false);

    // Modal içeriğini en üste kaydır - scrollToTop fonksiyonunu kullanarak
    if (modalContentRef.current) {
      scrollToTop({
        behavior: "instant",
        element: modalContentRef.current,
      });
    }
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: currentPage, limit: 20 }));
    setSelectedImageId(null);
    setLoadErrors({});
    setErrorNotified(false);
    success("Görseller yenilendi!");
  };

  const handleUseImage = () => {
    if (!selectedImageId) {
      warning("Lütfen önce bir görsel seçin.");
      return;
    }

    const foundImage = images.find((img) => img._id === selectedImageId);
    if (!foundImage) return;

    // Eğer görsel yüklenemedi hatası varsa uyarı ver
    if (loadErrors[foundImage._id]) {
      warning("Bu görsel erişilemez durumda. Kullanılamıyor.");
      return;
    }

    if (onSelectImage && typeof onSelectImage === "function") {
      onSelectImage(foundImage.url);
      success("Görsel başarıyla seçildi!");
      onClose();
    }
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

  if (!isOpen) return null;

  return (
    <>
      {/* Arka plan karartma */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Modal kutusu: yüksekliği %90 ve dikey scroll*/}
        <div
          ref={modalContentRef}
          className="bg-white rounded max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col p-6 modal-gallery-content"
        >
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
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Yükleniyor...</span>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {/* Görsel Galeri */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.length > 0 ? (
              images.map((image) => {
                const isSelected = image._id === selectedImageId;
                const hasError = loadErrors[image._id];

                return (
                  <div
                    key={image._id}
                    className={`border p-2 cursor-pointer ${
                      isSelected ? "border-blue-500" : "border-gray-200"
                    } ${
                      hasError ? "bg-red-50" : ""
                    } hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center`}
                    onClick={() => handleSelectImage(image._id)}
                  >
                    <div className="relative w-full h-24">
                      <img
                        src={image.url}
                        alt={image.altText || "Görsel"}
                        className={`w-full h-full object-cover ${
                          hasError ? "opacity-40" : ""
                        }`}
                        data-image-id={image._id}
                        onError={(e) => handleImageError(image._id, e)}
                      />
                      {hasError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            Erişilemiyor
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700 text-center font-medium truncate w-full">
                      {image.filename || image.name || "İsimsiz Görsel"}
                      {hasError && " (Silinmeli)"}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  Görüntülenecek görsel bulunamadı.
                </p>
              </div>
            )}
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

            {/* NextUI Pagination */}
            <div className="w-full flex justify-center flex-col items-center gap-1">
              <Pagination
                total={totalPages || 1}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="sm"
                showControls
                classNames={{
                  wrapper: "gap-0 overflow-visible",
                }}
              />
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
            setCurrentPage(1);
            dispatch(fetchImages({ page: 1, limit: 20 }));
          }}
        />
      )}
    </>
  );
};

export default ImageGalleryModal;
