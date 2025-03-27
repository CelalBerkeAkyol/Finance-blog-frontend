import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useNavigate } from "react-router-dom";
import { Button, Chip, Avatar } from "@nextui-org/react";
import ShareButtons from "../../buttons/ShareButtons";
import VoteButtons from "../../buttons/VoteButton";
import ScrollToTopButton from "../../buttons/ScrollToTopButton";
import { Icon } from "@iconify/react";

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

  // Navigate to team page
  const navigateToTeam = () => {
    navigate("/team");
  };

  // Tarih formatı
  const formattedDate = new Date(post.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Yazar bilgileri
  const authorName =
    typeof post.author === "object" && post.author?.userName
      ? post.author.userName
      : "İsimsiz Yazar";

  const authorOccupation =
    typeof post.author === "object" && post.author?.occupation
      ? post.author.occupation
      : "Yazar";

  // Avatar URL ve fallback işlemi
  const getAvatarUrl = () => {
    if (typeof post.author === "object" && post.author?.profileImage) {
      return post.author.profileImage;
    }
    // Yazarın adının baş harflerini kullan (NextUI Avatar'ın text özelliği için)
    return null;
  };

  return (
    <div className="prose p-2 sm:p-3 md:p-4 text-start w-full max-w-full md:max-w-3xl mx-auto">
      {/* Başlık - Boyutu ayarlandı */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Blog meta bilgileri - Mobil için daha düzenli */}
      <div
        id="blog-meta"
        className="mb-4 sm:mb-6 pb-4 border-b border-gray-100"
      >
        {/* Yazar bilgisi - Avatar içeren kart görünümü */}
        <div className="flex items-center mb-3 sm:mb-4">
          <Avatar
            size="md"
            src={getAvatarUrl()}
            name={authorName.substring(0, 2).toUpperCase()}
            color="primary"
            isBordered
            className="mr-3"
          />
          <div>
            <div className="flex flex-col">
              <span
                onClick={navigateToTeam}
                className="text-sm font-medium leading-tight cursor-pointer hover:text-primary transition-colors"
              >
                {authorName}
              </span>
              {/* Meslek bilgisi - Kullanıcı adına daha yakın */}
              <span className="text-xs text-gray-500 mt-0.5">
                {authorOccupation}
              </span>
            </div>
          </div>
        </div>

        {/* Meta bilgileri (Kategori, Tarih, Görüntüleme) - Aynı satırda */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500">
          {/* Kategori */}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate(`/blog/category/${post.category}`)}
          >
            <Icon icon="mdi:folder-outline" width={16} />
            <span className="hover:text-primary transition-colors">
              {slugToReadable(post.category)}
            </span>
          </div>

          {/* Tarih */}
          <div className="flex items-center gap-1">
            <Icon icon="mdi:calendar-outline" width={16} />
            <span>{formattedDate}</span>
          </div>

          {/* Görüntülenme */}
          <div className="flex items-center gap-1">
            <Icon icon="mdi:eye-outline" width={16} />
            <span>{post.views} görüntülenme</span>
          </div>
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
        <div className="flex items-center gap-2 align-middle">
          <ShareButtons url={currentURL} />
        </div>
      </div>

      {/* Yukarı Çık Butonu */}
      <ScrollToTopButton />
    </div>
  );
};

export default BlogPostComponent;
