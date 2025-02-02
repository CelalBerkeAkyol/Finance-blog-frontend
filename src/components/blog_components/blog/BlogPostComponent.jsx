import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api";
import { Button } from "@nextui-org/react";
import BlogPostSkeleton from "../BlogPostSkeleton";
import ServerErrorComponent from "../../../components/uyarılar/ServerErrorComponent";

const incrementPostView = async (postId) => {
  try {
    console.info(
      `BlogPostComponent: ${postId} için okunma sayısı artırılıyor.`
    );
    await axios.put(`/posts/${postId}/view`);
    console.info("BlogPostComponent: Okunma sayısı artırıldı.");
  } catch (error) {
    console.error("BlogPostComponent: Okunma sayısı artırılamadı:", error);
  }
};

const BlogPostComponent = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("BlogPostComponent: Geçersiz Post ID.");
      setError("Geçersiz Post ID");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      console.info(`BlogPostComponent: ${id} postu getiriliyor.`);
      try {
        const response = await axios.get(`/posts/one-post/${id}`);
        setPost(response.data.post);
        console.info("BlogPostComponent: Post başarıyla getirildi.");
        await incrementPostView(id);
      } catch (err) {
        console.error(
          "BlogPostComponent: API çağrısı sırasında hata oluştu:",
          err
        );
        setError("Blog yazısı yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  function slugToReadable(slug) {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (loading) return <BlogPostSkeleton />;
  if (error) return <ServerErrorComponent message={error} />;

  return (
    <div className="flex items-center justify-center py-12">
      <div className="prose p-4 min-w-[60%] text-start text-pretty">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div
          id="blog-details"
          className="flex flex-wrap items-center gap-8 text-gray-600 pb-4 border-b"
        >
          <Button
            color="primary"
            variant="ghost"
            radius="lg"
            size="sm"
            onClick={() => navigate(`/blog/category/${post.category}`)}
          >
            {slugToReadable(post.category)}
          </Button>
          <p className="text-sm flex items-center gap-1">
            🗓️{" "}
            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm flex items-center gap-1">
            ✍️ Yazar: {post.author.userName}
          </p>
          <p className="text-sm flex items-center gap-1">
            👀 {post.views} Görüntülenme
          </p>
        </div>
        <ReactMarkdown className="pt-6">{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPostComponent;
