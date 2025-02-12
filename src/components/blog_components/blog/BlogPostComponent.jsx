import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

// Kategori isimlerini okunabilir hale getiriyor
function slugToReadable(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const BlogPostComponent = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="prose p-4 text-start w-full max-w-4xl mx-auto">
      {/* Başlık */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

      {/* Blog detayları */}
      <div
        id="blog-details"
        className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 text-gray-600 pb-4 border-b"
      >
        {/* Kategori Butonu (Tam ekran olmaması için `w-auto`) */}
        <Button
          color="primary"
          variant="ghost"
          radius="lg"
          size="sm"
          className="w-auto px-4 py-1"
          onClick={() => navigate(`/blog/category/${post.category}`)}
        >
          {slugToReadable(post.category)}
        </Button>

        {/* Tarih, Yazar ve Görüntülenme Bilgileri YAN YANA olacak şekilde düzenlendi */}
        <div className="flex flex-wrap items-center gap-x-4 text-sm">
          <p className="flex items-center gap-1">
            🗓️{" "}
            {new Date(post.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="flex items-center gap-1">
            ✍️ Yazar: {post.author.userName}
          </p>
          <p className="flex items-center gap-1">
            👀 {post.views} Görüntülenme
          </p>
        </div>
      </div>

      {/* Blog İçeriği */}
      <div className="overflow-x-auto pt-6 text-base sm:text-lg leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPostComponent;
