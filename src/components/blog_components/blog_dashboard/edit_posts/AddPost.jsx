import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "../../../../app/features/blogs/postsSlice";
import { Input, Textarea, Button } from "@nextui-org/react";
import CategorySelector from "./CategorySelector";

const AddPost = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewPost(formData));
    setFormData({ title: "", content: "", category: "" });
  };

  const handleCategoryChange = (selectedCategory) => {
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
          minRows={25}
          maxRows={30}
          onChange={handleChange}
          value={formData.content}
          required
        />
        {/* Kategori ve Buton için sağa yaslanmış container */}
        <div className="flex justify-end gap-6">
          <CategorySelector
            selectedCategory={formData.category}
            onChange={handleCategoryChange}
            className="w-auto"
          />
          <Button type="submit" size="md" className="self-end">
            Ekle
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
