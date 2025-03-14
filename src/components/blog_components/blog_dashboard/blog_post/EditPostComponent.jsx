import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react";
import api from "../../../../api";
import CategorySelector from "../helpers/CategorySelector";
import StatusSelector from "../helpers/StatusSelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";

const EditPostComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    status: "taslak",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    console.info(`EditPostComponent: ${id} ID'li post getiriliyor.`);
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/one-post/${id}`);
        const post = response.data.post;
        setPostData({
          title: post.title || "",
          content: post.content || "",
          category: post.category || "kategori-yok",
          status: post.status || "taslak",
        });
        console.info("EditPostComponent: Post başarıyla getirildi.");
      } catch (err) {
        console.error("EditPostComponent: Post yüklenirken hata oluştu:", err);
        setError("Post yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (selectedCategory) => {
    console.info("EditPostComponent: Kategori değiştirildi:", selectedCategory);
    setPostData({ ...postData, category: selectedCategory });
  };

  const handleStatusChange = (status) => {
    console.info("EditPostComponent: Durum değiştirildi:", status);
    setPostData({ ...postData, status });
  };

  const handleUpdate = async () => {
    console.info(
      "EditPostComponent: Post güncelleme işlemi başlatılıyor.",
      postData
    );
    try {
      await api.put(`/posts/${id}`, postData, {
        headers: { "Content-Type": "application/json" },
      });
      console.info("EditPostComponent: Post güncellendi, yönlendiriliyor.");
      navigate("/dashboard/posts");
    } catch (error) {
      console.error("EditPostComponent: Güncelleme hatası:", error);
      setError("Güncelleme sırasında bir hata oluştu.");
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
            <Input
              type="text"
              name="title"
              label="Başlık"
              fullWidth
              value={postData.title || ""}
              onChange={handleChange}
              className="mb-4"
            />
            <Textarea
              name="content"
              label="İçerik"
              fullWidth
              minRows={20}
              maxRows={25}
              value={postData.content || ""}
              onChange={handleChange}
              className="mb-6"
            />

            {/* En altta, kategori, durum ve butonları aynı satıra alıyoruz */}
            <div className="flex items-center justify-evenly ">
              <CategorySelector
                selectedCategory={postData.category}
                onChange={handleCategoryChange}
              />
              <StatusSelector
                value={postData.status}
                onChange={handleStatusChange}
              />
              <Button onClick={() => setIsGalleryOpen(true)}>Görseller</Button>
              <Button color="primary" onClick={handleUpdate}>
                Güncelle
              </Button>
            </div>
          </>
        )}
      </Card>
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default EditPostComponent;
