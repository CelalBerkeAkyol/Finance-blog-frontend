// src/app/features/blog/AddPost.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "../../../../app/features/blogs/postsSlice";
import { Input, Textarea, Button } from "@nextui-org/react";
import CategorySelector from "./CategorySelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";

const AddPost = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.info("AddPost: Yeni post ekleme işlemi başlatılıyor.", formData);
    dispatch(addNewPost(formData))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          console.info("AddPost: Post başarıyla eklendi.");
          setFormData({ title: "", content: "", category: "" });
        } else {
          console.error(
            "AddPost: Post eklenirken hata oluştu:",
            result.payload
          );
        }
      })
      .catch((error) => console.error("AddPost: Hata oluştu:", error));
  };

  const handleCategoryChange = (selectedCategory) => {
    console.info("AddPost: Kategori değiştirildi:", selectedCategory);
    setFormData((prevData) => ({ ...prevData, category: selectedCategory }));
  };

  return (
    <div className="p-8 mb-4 w-[80%] h-screen">
      <h2 className="text-xl font-bold mb-4">Yeni Post Ekle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          clearable
          label="Başlık"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Textarea
          clearable
          label="İçerik"
          name="content"
          rows={20}
          onChange={handleChange}
          value={formData.content}
          required
        />
        <div className="flex justify-between items-center">
          <CategorySelector
            selectedCategory={formData.category}
            onChange={handleCategoryChange}
            className="w-auto"
          />
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
