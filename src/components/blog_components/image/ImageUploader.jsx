// image yüklemeye yarar Görseller çoklu seçilebilir. Açıklama girilebilir
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Çoklu dosya yükleme için hazırladığınız yeni action
import { uploadImages } from "../../../app/features/image/imageSlice";

const ImageUploader = () => {
  // Tek bir file yerine dizi (array) tutalım
  const [files, setFiles] = useState([]);
  const [altText, setAltText] = useState(""); // İsterseniz boş geçilebilir
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.imageUpload);

  // Birden fazla dosya seçimini yönetmek
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Form submit: birden fazla dosyayı aynı anda yollayacağız
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Lütfen en az bir görsel seçin.");
      return;
    }

    const formData = new FormData();
    // altText boş olabilir; zorunlu değilse eklemeyin veya bu satırı çıkarın
    formData.append("altText", altText);

    // Birden fazla dosya eklemesi
    files.forEach((file) => {
      formData.append("image", file);
    });

    // Artık tekli yerine çoklu yükleme action'ını çağırıyoruz
    dispatch(uploadImages(formData));
  };

  return (
    <div className="p-4 border rounded">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image" className="block font-medium">
            Görsel Seç (Çoklu):
          </label>
          {/* multiple özelliği ekliyoruz */}
          <input
            type="file"
            id="image"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="altText" className="block font-medium">
            Resim Açıklaması (Opsiyonel):
          </label>
          <input
            type="text"
            id="altText"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Yükleniyor..." : "Yükle"}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {success && (
          <p className="mt-2 text-green-500">Görseller başarıyla yüklendi!</p>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;
