import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImages,
  deleteImage,
  clearImageErrors,
} from "../../app/features/image/imageGallerySlice";
import { Button, Pagination, Checkbox } from "@nextui-org/react";
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

  // Tek görsel seçim yerine çoklu seçim için array kullanıyoruz
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadErrors, setLoadErrors] = useState({});
  const [errorNotified, setErrorNotified] = useState(false);
  // Toplu seçim modu
  const [selectMode, setSelectMode] = useState(false);

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

  // Çoklu görsel seçim işlemi
  const handleSelectImage = (id) => {
    if (selectMode) {
      // Çoklu seçim modu açıksa
      setSelectedImageIds((prev) => {
        if (prev.includes(id)) {
          // Görsel zaten seçiliyse kaldır
          return prev.filter((imageId) => imageId !== id);
        } else {
          // Görsel seçili değilse ekle
          return [...prev, id];
        }
      });
    } else {
      // Tek seçim modu - eski davranış
      setSelectedImageIds((prev) => {
        if (prev.length === 1 && prev[0] === id) {
          // Seçili görsele tekrar tıklanırsa seçimi kaldır
          return [];
        } else {
          // Yeni görsel seç
          return [id];
        }
      });
    }
  };

  // Tüm görselleri seç/seçimi kaldır
  const handleSelectAll = () => {
    if (selectedImageIds.length === images.length) {
      // Tüm görseller seçiliyse seçimleri kaldır
      setSelectedImageIds([]);
    } else {
      // Tüm görselleri seç
      setSelectedImageIds(images.map((img) => img._id));
    }
  };

  // Seçili tüm öğeleri sil
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
    let totalToDelete = selectedImageIds.length;

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

  // Kopyalama
  const handleCopy = () => {
    if (selectedImageIds.length === 0) {
      warning("Lütfen bir görsel seçin.");
      return;
    }

    // Çoklu seçimde sadece ilk görseli kopyala
    const selectedId = selectedImageIds[0];
    const foundImage = images.find((img) => img._id === selectedId);

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

    // Tek görsel silme işlemi
    const selectedId = selectedImageIds[0];
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    // Görsel zaten erişilemez durumdaysa, doğrudan veritabanından silme işlemi yap
    const isErrorImage = loadErrors[selectedId];

    dispatch(deleteImage(selectedId))
      .unwrap()
      .then((result) => {
        // Hata listesinden görsel ID'sini sil
        setLoadErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[selectedId];
          return newErrors;
        });

        if (isErrorImage) {
          success("Erişilemeyen görsel veritabanından temizlendi!");
        } else {
          success("Görsel başarıyla silindi.");
        }

        // Seçimi temizle ve görüntüyü yenile
        setSelectedImageIds([]);
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
    setSelectedImageIds([]);
    setLoadErrors({}); // Sayfa değiştiğinde hataları sıfırla
    setErrorNotified(false); // Bildirim durumunu sıfırla
  };

  const handleReload = () => {
    dispatch(fetchImages({ page: currentPage, limit: 20 }));
    setSelectedImageIds([]);
    setLoadErrors({}); // Yeniden yüklerken hataları sıfırla
    setErrorNotified(false); // Bildirim durumunu sıfırla
    success("Görseller yenilendi.");
  };

  // "Görsel Ekle" butonu: modal aç
  const handleAddImage = () => {
    setIsUploaderOpen(true);
  };

  // Çoklu seçim modunu değiştir
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedImageIds([]); // Seçimi sıfırla
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

  // Seçili hatalı görselleri sil
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

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar solda sabit */}
      <BlogSidebarComponent />

      {/* İçerik */}
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        {/* Üst Butonlar */}
        <div className="mb-4">
          {/* Küçük ekranlarda esnek düzen için iyileştirilmiş buton alanı */}
          <div className="flex flex-col gap-3">
            {/* Üst kontrol grubu - mobil ekranlarda tek satır ya da dikey düzen */}
            <div className="flex flex-wrap justify-between items-center">
              {/* Seçim butonları - mobil için optimize edilmiş */}
              <div className="flex flex-wrap items-center gap-1 mb-2 sm:mb-0">
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
                  className="min-w-0 sm:min-w-[120px]"
                >
                  <span className="hidden sm:inline">
                    {selectMode ? "Seçim Modunu Kapat" : "Çoklu Seçim"}
                  </span>
                  <span className="sm:hidden">
                    {selectMode ? "Seçim Kapalı" : "Seçim"}
                  </span>
                </Button>

                {selectMode && (
                  <Button
                    variant="flat"
                    color="default"
                    size="sm"
                    onPress={handleSelectAll}
                    className="min-w-0 sm:min-w-[100px]"
                  >
                    <span className="hidden sm:inline">
                      {selectedImageIds.length === images.length
                        ? "Tümünü Kaldır"
                        : "Tümünü Seç"}
                    </span>
                    <span className="sm:hidden">
                      {selectedImageIds.length === images.length
                        ? "Kaldır"
                        : "Tümü"}
                    </span>
                  </Button>
                )}

                {Object.keys(loadErrors).length > 0 && (
                  <Button
                    variant="flat"
                    color="warning"
                    size="sm"
                    onPress={handleDeleteErrorImages}
                    className="min-w-0"
                  >
                    <span className="hidden sm:inline">
                      Erişilemeyen Görselleri Sil
                    </span>
                    <span className="sm:hidden">Hataları Sil</span>
                  </Button>
                )}
              </div>

              {/* İşlem butonları - mobil için optimize edilmiş */}
              <div className="flex flex-wrap gap-1 items-center">
                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  startContent={<Icon icon="material-symbols:refresh" />}
                  onPress={handleReload}
                  className="min-w-0 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Yenile</span>
                </Button>

                <Button
                  variant="flat"
                  color="default"
                  size="sm"
                  onPress={handleCopy}
                  isDisabled={selectedImageIds.length !== 1}
                  className="min-w-0 px-2 sm:px-3"
                  startContent={<Icon icon="material-symbols:content-copy" />}
                >
                  <span className="hidden sm:inline">Kopyala</span>
                </Button>

                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  onPress={
                    selectedImageIds.length > 1
                      ? handleBulkDelete
                      : handleDelete
                  }
                  isDisabled={selectedImageIds.length === 0}
                  className="min-w-0 px-2 sm:px-3"
                  startContent={<Icon icon="material-symbols:delete" />}
                >
                  <span className="hidden sm:inline">
                    {selectedImageIds.length > 1
                      ? `${selectedImageIds.length} Sil`
                      : "Sil"}
                  </span>
                </Button>

                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={handleAddImage}
                  className="min-w-0 px-2 sm:px-3"
                  startContent={<Icon icon="material-symbols:add" />}
                >
                  <span className="hidden sm:inline">Görsel Ekle</span>
                  <span className="sm:hidden">Ekle</span>
                </Button>
              </div>
            </div>

            {/* Seçim bilgisi - mobil ekranlarda da görünür kalması için */}
            {selectedImageIds.length > 0 && (
              <div className="text-xs sm:text-sm text-blue-600 mt-1">
                {selectedImageIds.length} görsel seçildi
              </div>
            )}
          </div>
        </div>

        {/* İçerik */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm sm:text-base">Yükleniyor...</span>
          </div>
        )}

        {/* Grid düzenini daha uyumlu hale getir */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((img) => {
              const isSelected = selectedImageIds.includes(img._id);
              const hasError = loadErrors[img._id];

              return (
                <div
                  key={img._id}
                  onClick={() => handleSelectImage(img._id)}
                  className={`cursor-pointer border p-1 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } ${
                    hasError ? "bg-red-50" : ""
                  } hover:border-blue-300 transition-colors relative`}
                >
                  {selectMode && (
                    <div className="absolute top-1 left-1 z-10">
                      <Checkbox
                        isSelected={isSelected}
                        color="primary"
                        size="sm"
                        className="bg-white bg-opacity-80 rounded"
                      />
                    </div>
                  )}
                  <div className="relative w-full h-24 sm:h-36">
                    <img
                      src={img.url}
                      alt={img.altText || "Görsel"}
                      className={`w-full h-full object-cover ${
                        hasError ? "opacity-40" : ""
                      } ${isSelected ? "opacity-90" : ""}`}
                      data-image-id={img._id}
                      onError={(e) => handleImageError(img._id, e)}
                    />
                    {hasError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          <span className="hidden sm:inline">Erişilemiyor</span>
                          <span className="sm:hidden">Hata</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-4 sm:py-8">
              <p className="text-gray-500 text-sm sm:text-base">
                Görüntülenecek görsel bulunamadı.
              </p>
            </div>
          )}
        </div>

        {/* Sayfalama - NextUI Pagination - mobil optimizasyonu */}
        <div className="mt-4 sm:mt-6 flex justify-center flex-col items-center">
          <Pagination
            total={totalPages || 1}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="sm"
            showControls
            classNames={{
              wrapper: "gap-0 overflow-visible scale-90 sm:scale-100",
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
