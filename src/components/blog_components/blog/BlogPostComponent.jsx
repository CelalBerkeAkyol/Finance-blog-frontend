// blog yazısının içeriği
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom"; // Dinamik parametre için
import axios from "../../../api";
import { Button } from "@nextui-org/react";
import BlogPostSkeleton from "../BlogPostSkeleton";
import ServerErrorComponent from "../../../components/uyarılar/ServerErrorComponent";
const incrementPostView = async (postId) => {
  try {
    await axios.put(`/posts/${postId}/view`);
  } catch (error) {
    console.error("Okunma sayısı artırılamadı:", error);
  }
};

const BlogPostComponent = () => {
  const { id } = useParams(); // Dinamik parametreyi al
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Geçersiz Post ID");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/one-post/${id}`);
        setPost(response.data.post);

        await incrementPostView(id); // Görüntülenme sayısını artır
      } catch (err) {
        console.error("API çağrısı sırasında hata oluştu:", err);
        setError("Blog yazısı yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false); // Her durumda yüklenme durumunu sonlandır
      }
    };

    fetchPost();
  }, [id]);
  const navigate = useNavigate();
  // blog kategorilerinin okunabilir olması için bir fonksiyon
  function slugToReadable(slug) {
    return slug
      .split("-") // Tireleri kes
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Her kelimenin ilk harfini büyük yap
      .join(" "); // Kelimeleri boşlukla birleştir
  }
  if (loading) return <BlogPostSkeleton />; // Yüklenme durumu
  if (error) return <ServerErrorComponent message={error} />; // Hata durumu

  return (
    <div className="flex items-center justify-center py-12">
      <div className="prose p-4 min-w-[60%] text-start text-pretty">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Blog Post Üst Bilgileri */}
        <div
          id="blog-details"
          className="flex flex-wrap items-center gap-8 text-gray-600 pb-4 border-b"
        >
          {/* Kategori Butonu */}
          <Button
            color="primary"
            variant="ghost"
            radius="lg"
            size="sm"
            onClick={() => navigate(`/blog/category/${post.category}`)}
          >
            {slugToReadable(post.category)}
          </Button>

          {/* Tarih */}
          <p className="text-sm flex items-center gap-1">
            🗓️{" "}
            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Yazar */}
          <p className="text-sm flex items-center gap-1">
            ✍️ Yazar: {post.author.userName}
          </p>
          {/* Görüntülenme Sayısı */}
          <p className="text-sm flex items-center gap-1">
            👀 {post.views} Görüntülenme
          </p>
        </div>

        {/* Blog İçeriği */}
        <ReactMarkdown className="pt-6">{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPostComponent;
