// blog yazısının içeriği
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom"; // Dinamik parametre için
import axios from "../../../api";
import { Button } from "@nextui-org/react";
import BlogPostSkeleton from "../BlogPostSkeleton";

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
  if (error) return <div className="text-red-500">{error}</div>; // Hata durumu

  return (
    <div className="flex items-center justify-center py-12">
      <div className="prose p-4 min-w-[60%]  text-start text-pretty">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div id="blog-details" className="flex flex-row gap-8 pb-4 border-b">
          <Button
            color="primary"
            variant="ghost"
            radius="lg"
            size="sm"
            onClick={() => navigate(`/blog/category/${post.category}`)}
          >
            {slugToReadable(post.category)}
          </Button>

          <span>
            <strong>Görüntülenme:</strong> {post.views}
          </span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <ReactMarkdown className="pt-2">{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPostComponent;
