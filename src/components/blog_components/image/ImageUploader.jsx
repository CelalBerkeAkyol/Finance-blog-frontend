import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../../app/features/image/imageSlice";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.imageUpload);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !altText) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("altText", altText);

    dispatch(uploadImage(formData));
  };

  return (
    <div className="p-4 border rounded">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image" className="block font-medium">
            Görsel Seç:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="altText" className="block font-medium">
            Resim Açıklaması:
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
          <p className="mt-2 text-green-500">Görsel başarıyla yüklendi!</p>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;
