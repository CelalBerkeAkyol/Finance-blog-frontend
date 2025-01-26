import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react"; // NextUI Bileşenleri
import api from "../../../../api";

const EditPostComponent = () => {
  const { id } = useParams(); // URL'den postId'yi al
  const navigate = useNavigate();

  // Form state
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa açıldığında ilgili postu API’den çek
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/one-post/${id}`); // API isteği

        setPostData(response.data.post); // State'e kaydet
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-[60%] p-6 bg-white shadow-lg  min-h-screen  rounded-lg">
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
              minRows={12}
              maxRows={30}
              value={postData.content || ""}
              onChange={handleChange}
              className="mb-6 "
            />

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
