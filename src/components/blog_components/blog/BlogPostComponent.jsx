import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import ShareButtons from "../../buttons/ShareButtons";
import VoteButtons from "../../buttons/VoteButton";
import ScrollToTopButton from "../../buttons/ScrollToTopButton";
// Kategori isimlerini okunabilir hale getiriyor
function slugToReadable(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const BlogPostComponent = ({ post }) => {
  const navigate = useNavigate();
  const currentURL = window.location.href; // Sayfanın mevcut URL'si

  return (
    <div className="prose p-2 sm:p-3 md:p-4 text-start w-full max-w-full md:max-w-3xl mx-auto">
      {/* Başlık */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
        {post.title}
      </h1>

      {/* Blog detayları */}
      <div
        id="blog-details"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 pb-3 md:pb-4 border-b"
      >
        {/* Sol Taraf: Kategori Butonu ve Post Bilgileri */}
        <div className="flex flex-wrap gap-2 md:gap-4 text-xs sm:text-sm leading-tight">
          <Button
            color="secondary"
            variant="ghost"
            radius="lg"
            size="sm"
            className="w-auto px-3 py-1"
            onClick={() => navigate(`/blog/category/${post.category}`)}
          >
            {slugToReadable(post.category)}
          </Button>
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

        {/* Sağ Taraf: Paylaşım Butonları */}
        <div className="flex items-center gap-2">
          <ShareButtons url={currentURL} />
        </div>
      </div>

      {/* Blog İçeriği */}
      <div className="overflow-x-auto pt-3 md:pt-4 text-sm sm:text-base leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Upvote & Downvote ve Yukarı Çık Butonu */}
      <div className="flex justify-between items-center w-full mt-2 pt-3 md:pt-4 border-t-1">
        {/* Beğeni Butonları (Sol Tarafta) */}
        <VoteButtons postId={post._id} />

        {/* Paylaşım Butonları (Sağ Tarafta) */}
        <div className="flex items-center gap-2 algin-middle">
          <ShareButtons url={currentURL} />
        </div>
      </div>

      {/* Yukarı Çık Butonu */}
      <ScrollToTopButton />
    </div>
  );
};

export default BlogPostComponent;
