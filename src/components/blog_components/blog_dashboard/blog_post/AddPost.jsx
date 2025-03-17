// src/app/features/blog/AddPost.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "../../../../app/features/blogs/postsSlice";
import { Input, Textarea, Button } from "@nextui-org/react";
import CategorySelector from "../helpers/CategorySelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";

const AddPost = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    summary: "",
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    category: false,
    summary: false,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Özet alanı için karakter sayısını güncelle
    if (name === "summary") {
      setCharCount(value.length);
    }

    if (showErrors) {
      setErrors((prev) => ({ ...prev, [name]: !value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tüm alanların dolu olduğunu kontrol et
    const newErrors = {
      title: !formData.title,
      content: !formData.content,
      summary: !formData.summary,
      category: !formData.category,
    };

    setErrors(newErrors);
    setShowErrors(true);

    dispatch(addNewPost(formData))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setFormData({ title: "", content: "", category: "", summary: "" });
          setShowErrors(false);
        }
      })
      .catch((error) => console.error("AddPost: Hata oluştu:", error));
  };

  const handleCategoryChange = (selectedCategory) => {
    setFormData((prevData) => ({ ...prevData, category: selectedCategory }));
    if (showErrors) {
      setErrors((prev) => ({ ...prev, category: !selectedCategory }));
    }
  };

  return (
    <div className="p-8 mb-4 w-[80%] h-screen">
      <h2 className="text-xl font-bold mb-4">Yeni Post Ekle</h2>
      {showErrors && Object.values(errors).some((error) => error) && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">Lütfen tüm alanları doldurun.</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          clearable
          label="Başlık"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          color={errors.title && showErrors ? "danger" : "default"}
          errorMessage={
            errors.title && showErrors ? "Başlık alanı zorunludur" : ""
          }
        />
        <div className="relative">
          <Textarea
            clearable
            label="Özet (Maksimum 200 karakter)"
            name="summary"
            maxLength={200}
            minRows={2}
            maxRows={4}
            value={formData.summary}
            onChange={handleChange}
            placeholder="Yazınızın kısa bir özetini girin (maksimum 200 karakter)"
            required
            color={errors.summary && showErrors ? "danger" : "default"}
            errorMessage={
              errors.summary && showErrors ? "Özet alanı zorunludur" : ""
            }
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {charCount}/200
          </div>
        </div>
        <Textarea
          clearable
          label="İçerik"
          name="content"
          minRowsrows={20}
          maxRows={25}
          onChange={handleChange}
          value={formData.content}
          required
          color={errors.content && showErrors ? "danger" : "default"}
          errorMessage={
            errors.content && showErrors ? "İçerik alanı zorunludur" : ""
          }
        />
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CategorySelector
              selectedCategory={formData.category}
              onChange={handleCategoryChange}
              className="w-auto"
              required
              isInvalid={errors.category && showErrors}
            />
            {errors.category && showErrors && (
              <span className="text-red-500 text-xs mt-1">
                Kategori seçimi zorunludur
              </span>
            )}
          </div>
          <div className="flex gap-4">
            {/* Görseller butonu */}
            <Button type="button" onClick={() => setIsGalleryOpen(true)}>
              Görseller
            </Button>
            <Button type="submit" size="md" className="self-end">
              Ekle
            </Button>
          </div>
        </div>
      </form>
      {/* Modal'ı ekrana getiriyoruz */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default AddPost;
