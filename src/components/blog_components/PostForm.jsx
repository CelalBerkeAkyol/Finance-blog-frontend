import React, { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";

export default function PostForm({ onSave, postToEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    if (postToEdit) setFormData(postToEdit);
  }, [postToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ title: "", content: "", category: "" }); // Formu sıfırla
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        name="title"
        placeholder="Enter title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Content"
        name="content"
        placeholder="Enter content"
        value={formData.content}
        onChange={handleChange}
        required
      />
      <Input
        label="Category"
        name="category"
        placeholder="Enter category"
        value={formData.category}
        onChange={handleChange}
      />
      <Button type="submit" color="primary">
        Save
      </Button>
    </form>
  );
}
