import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ShareButtons from "../../buttons/ShareButtons";
import VoteButtons from "../../buttons/VoteButton";
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

  // Sayfanın en yukarısına çıkma fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="prose p-4 text-start w-full max-w-4xl mx-auto">
      {/* Başlık */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

      {/* Blog detayları */}
      <div
        id="blog-details"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  pb-4 border-b"
      >
        {/* Sol Taraf: Kategori Butonu ve Post Bilgileri */}
        <div className="flex flex-wrap  gap-4 text-sm leading-tight">
          <Button
            color="secondary"
            variant="ghost"
            radius="lg"
            size="sm"
            className="w-auto px-4 py-1"
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
      <div className="overflow-x-auto pt-4 text-base leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Upvote & Downvote ve Yukarı Çık Butonu */}

      <div className="flex justify-between items-center w-full mt-2 pt-4 border-t-1">
        {/* Beğeni Butonları (Sol Tarafta) */}
        <VoteButtons postId={post._id} />

        {/* Paylaşım Butonları (Sağ Tarafta) */}
        <div className="flex items-center gap-2 algin-middle">
          <ShareButtons url={currentURL} />
        </div>
      </div>

      {/* Yukarı Çık Butonu */}
      <div className="fixed bottom-5 right-5">
        <Button
          onClick={scrollToTop}
          className="bg-gray-700 text-white  rounded-full shadow-lg hover:bg-gray-900 hover:text-white transition-all"
        >
          <Icon icon="mdi:arrow-up" width="18" />
        </Button>
      </div>
    </div>
  );
};

export default BlogPostComponent;
