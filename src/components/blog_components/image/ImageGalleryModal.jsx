// src/app/components/ImageGalleryModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
} from "../../../app/features/image/imageGallerySlice";
import { Button, Pagination, Checkbox } from "@nextui-org/react";
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

  // Çoklu seçim için bir dizi kullanıyoruz
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadErrors, setLoadErrors] = useState({});
  const [errorNotified, setErrorNotified] = useState(false);
  // Çoklu seçim modu
  const [selectMode, setSelectMode] = useState(false);

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
      setSelectedImageIds([]);
      setSelectMode(false);
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

  // Çoklu seçim modu değiştirme
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedImageIds([]);
  };

  // Tüm görselleri seç/kaldır
  const handleSelectAll = () => {
    if (selectedImageIds.length === images.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(images.map((img) => img._id));
    }
  };

  // Görsel seçme işlemi
  const handleSelectImage = (id) => {
    if (selectMode) {
      // Çoklu seçim modu
      setSelectedImageIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((imageId) => imageId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      // Tek seçim modu
      setSelectedImageIds((prev) => {
        if (prev.length === 1 && prev[0] === id) {
          return [];
        } else {
          return [id];
        }
      });
    }
  };

  // Kopyalama
  const handleCopy = () => {
    if (selectedImageIds.length === 0) {
      warning("Lütfen önce bir görsel seçin.");
      return;
    }
    // Çoklu seçimde sadece ilk görseli kopyala
    const selectedId = selectedImageIds[0];
    const foundImage = images.find((img) => img._id === selectedId);
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

  // Toplu silme
  const handleBulkDelete = () => {
    if (selectedImageIds.length === 0) {
      warning("Lütfen silmek için en az bir görsel seçin.");
      return;
    }

    if (
      !window.confirm(
        `${selectedImageIds.length} görseli silmek istediğinize emin misiniz?`
      )
    )
      return;

    // Silme işlemleri için sayaç
    let successCount = 0;
    let errorCount = 0;

    // Her bir görsel için silme işlemi gerçekleştir
    const deletePromises = selectedImageIds.map((id) => {
      return dispatch(deleteImage(id))
        .unwrap()
        .then(() => {
          // Başarılı silme
          successCount++;
          // Hata listesinden kaldır
          setLoadErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
          });
        })
        .catch((err) => {
          console.error(`Görsel silme hatası (ID: ${id}):`, err);
          errorCount++;
        });
    });

    // Tüm silme işlemleri tamamlandığında
    Promise.all(deletePromises)
      .then(() => {
        // Silme sonuçlarını göster
        if (successCount > 0) {
          success(`${successCount} görsel başarıyla silindi.`);
        }
        if (errorCount > 0) {
          showError(`${errorCount} görsel silinirken hata oluştu.`);
        }

        // Silinen görselleri seçim listesinden kaldır
        setSelectedImageIds([]);
        // Sayfayı yenile
        dispatch(fetchImages({ page: currentPage, limit: 20 }));
      })
      .catch((err) => {
        console.error("Toplu silme hatası:", err);
        showError("Görseller silinirken bir hata oluştu.");
      });
  };

  // Tek görsel silme
  const handleDelete = () => {
    if (selectedImageIds.length === 0) {
      warning("Lütfen silmek için bir görsel seçin.");
      return;
    }

    // Çoklu seçimde birden fazla görsel varsa toplu silme fonksiyonunu kullan
    if (selectedImageIds.length > 1) {
      handleBulkDelete();
      return;
    }

    // Tek görsel silme
    const selectedId = selectedImageIds[0];
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) {
      return;
    }

    // Görsel zaten erişilemez durumdaysa, doğrudan veritabanından silme işlemi yap
    const isErrorImage = loadErrors[selectedId];

    dispatch(deleteImage(selectedId))
      .unwrap()
      .then(() => {
        dispatch(fetchImages({ page: currentPage, limit: 20 }));
        setSelectedImageIds([]);
        // Hata listesinden görsel ID'sini sil
        setLoadErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[selectedId];
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

  // Erişilemeyen görselleri toplu silme
  const handleDeleteErrorImages = () => {
    // Hatalı görselleri bul
    const errorImageIds = Object.keys(loadErrors);

    if (errorImageIds.length === 0) {
      warning("Silinecek erişilemeyen görsel bulunamadı.");
      return;
    }

    if (
      !window.confirm(
        `${errorImageIds.length} erişilemeyen görseli silmek istediğinize emin misiniz?`
      )
    )
      return;

    // Tüm hatalı görselleri seç ve sil
    setSelectedImageIds(errorImageIds);

    // setTimeout kullanarak state güncellemesinin tamamlanmasını bekle
    setTimeout(() => {
      handleBulkDelete();
    }, 100);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedImageIds([]);
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
    setSelectedImageIds([]);
    setLoadErrors({});
    setErrorNotified(false);
    success("Görseller yenilendi!");
  };

  const handleUseImage = () => {
    if (selectedImageIds.length === 0) {
      warning("Lütfen önce bir görsel seçin.");
      return;
    }

    // Çoklu seçimde sadece ilk görseli kullan
    const selectedId = selectedImageIds[0];
    const foundImage = images.find((img) => img._id === selectedId);
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
          {/* Üst kısım: Başlık ve Butonlar */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
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

            {/* Seçim Kontrolleri */}
            <div className="flex items-center gap-2">
              <Button
                variant="flat"
                color={selectMode ? "primary" : "default"}
                size="sm"
                startContent={
                  <Icon
                    icon={
                      selectMode
                        ? "material-symbols:check-box-outline"
                        : "material-symbols:check-box-outline-blank"
                    }
                  />
                }
                onPress={toggleSelectMode}
              >
                {selectMode ? "Seçim Modunu Kapat" : "Çoklu Seçim Modu"}
              </Button>

              {selectMode && (
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={handleSelectAll}
                >
                  {selectedImageIds.length === images.length
                    ? "Tümünün Seçimini Kaldır"
                    : "Tümünü Seç"}
                </Button>
              )}

              {Object.keys(loadErrors).length > 0 && (
                <Button
                  variant="flat"
                  color="warning"
                  size="sm"
                  onPress={handleDeleteErrorImages}
                >
                  Erişilemeyen Görselleri Sil
                </Button>
              )}

              {selectedImageIds.length > 0 && (
                <span className="text-sm text-blue-600 ml-2">
                  {selectedImageIds.length} görsel seçildi
                </span>
              )}
            </div>
          </div>

          {/* Yükleniyor */}
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
                const isSelected = selectedImageIds.includes(image._id);
                const hasError = loadErrors[image._id];

                return (
                  <div
                    key={image._id}
                    className={`border p-2 cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    } ${
                      hasError ? "bg-red-50" : ""
                    } hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center relative`}
                    onClick={() => handleSelectImage(image._id)}
                  >
                    {selectMode && (
                      <div className="absolute top-1 left-1 z-10">
                        <Checkbox
                          isSelected={isSelected}
                          color="primary"
                          className="bg-white bg-opacity-80 rounded"
                        />
                      </div>
                    )}
                    <div className="relative w-full h-24">
                      <img
                        src={image.url}
                        alt={image.altText || "Görsel"}
                        className={`w-full h-full object-cover ${
                          hasError ? "opacity-40" : ""
                        } ${isSelected ? "opacity-90" : ""}`}
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
                isDisabled={selectedImageIds.length !== 1}
              >
                Kopyala
              </Button>
              {onSelectImage && (
                <Button
                  variant="flat"
                  color="primary"
                  radius="md"
                  onPress={handleUseImage}
                  isDisabled={selectedImageIds.length !== 1}
                >
                  Kullan
                </Button>
              )}
              <Button
                variant="flat"
                color="danger"
                radius="md"
                onPress={
                  selectedImageIds.length > 1 ? handleBulkDelete : handleDelete
                }
                isDisabled={selectedImageIds.length === 0}
              >
                {selectedImageIds.length > 1
                  ? `${selectedImageIds.length} Görseli Sil`
                  : "Sil"}
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
