import axios from "../../../../../api";

// Resim yükleme servisi fonksiyonları
export const uploadProfileImage = async (
  selectedImage,
  setUploadingImage,
  errorCallback
) => {
  if (!selectedImage) return null;

  try {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await axios.post("/images/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (
      response.data.success &&
      response.data.data &&
      response.data.data.length > 0
    ) {
      return response.data.data[0].url;
    } else {
      throw new Error("Resim yükleme başarısız");
    }
  } catch (err) {
    errorCallback(
      "Profil resmi yüklenirken bir hata oluştu: " +
        (err.message || "Bilinmeyen hata")
    );
    return null;
  } finally {
    setUploadingImage(false);
  }
};

// Resim doğrulama işlemleri
export const validateImageFile = (file, errorCallback) => {
  if (!file) return false;

  // Dosya türü doğrulama
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    errorCallback("Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WEBP)");
    return false;
  }

  // Dosya boyutu doğrulama (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errorCallback("Resim dosyası 5MB'dan küçük olmalıdır");
    return false;
  }

  return true;
};

// Resim önizleme oluşturma
export const createImagePreview = (file, setImagePreview) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result);
  reader.readAsDataURL(file);
};
