import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react"; // NextUI Bileşenleri
import api from "../../../../api";
import CategorySelector from "./CategorySelector"; // CategorySelector Bileşeni
import StatusSelector from "./StatusSelector"; // StatusSelector Bileşeni

const EditPostComponent = () => {
  const { id } = useParams(); // URL'den postId'yi al
  const navigate = useNavigate();

  // Form state
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "", // Kategori eklendi
    status: "taslak", // Varsayılan olarak "taslak"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa açıldığında ilgili postu API’den çek
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/one-post/${id}`); // API isteği
        const post = response.data.post;

        // Post verisini mevcut haliyle state’e set et
        setPostData({
          title: post.title || "",
          content: post.content || "",
          category: post.category || "kategori-yok", // Varsayılan kategori
          status: post.status || "taslak", // Varsayılan durum
        });

        setLoading(false);
      } catch (err) {
        console.error("Post yüklenirken hata oluştu:", err);
        setError("Post yüklenirken hata oluştu.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Input değişikliklerini takip et
  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  // Kategori değişikliği
  const handleCategoryChange = (selectedCategory) => {
    setPostData({ ...postData, category });
  };

  // Durum değişikliği
  const handleStatusChange = (status) => {
    setPostData({ ...postData, status });
  };

  // Güncelleme işlemi
  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${id}`, postData, {
        headers: { "Content-Type": "application/json" },
      }); // API isteği
      navigate("/blog-admin/posts"); // Güncelleyince geri yönlendir
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-full max-w-[80%] p-6 bg-white shadow-lg min-h-screen rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Postu Düzenle</h1>

        {loading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Başlık Girişi */}
            <Input
              type="text"
              name="title"
              label="Başlık"
              fullWidth
              value={postData.title || ""}
              onChange={handleChange}
              className="mb-4"
            />

            {/* İçerik Girişi */}
            <Textarea
              name="content"
              label="İçerik"
              fullWidth
              minRows={20}
              maxRows={30}
              value={postData.content || ""}
              onChange={handleChange}
              className="mb-6"
            />

            <div className="flex justify-around px-4">
              {/* Kategori Seçimi */}
              <CategorySelector
                selectedCategory={postData.category}
                onChange={handleCategoryChange}
              />

              {/* Durum Seçimi */}
              <StatusSelector
                value={postData.status}
                onChange={handleStatusChange}
              />
            </div>

            {/* Güncelle Butonu */}
            <Button color="primary" fullWidth onClick={handleUpdate}>
              Güncelle
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default EditPostComponent;
