import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Kategori isimlerini okunabilir hale getirmek için kullanılıyor
function slugToReadable(slug) {
  if (!slug) return "Kategori Yok";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Başlığı kısaltan fonksiyon (örnek: max 200 karakter)
function truncateText(text, maxLength = 200) {
  if (!text) return "İçerik yok";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const PostCardComponent = ({ post }) => {
  const navigate = useNavigate();

  const handleView = () => {
    // Post görüntüleme işlemleri
  };

  // Gösterilecek özet bilgisini ayarla
  const summarySource =
    post.summary && post.summary.trim() !== "" ? post.summary : post.content;
  const finalSummary = truncateText(summarySource, 200);

  // Navigate to post detail page
  const navigateToPost = (e) => {
    // Only navigate if the click was not on a link or other interactive element
    if (!e.target.closest("a") && !e.target.closest("button")) {
      navigate(`/blog/post/${post._id}`);
    }
  };

  // Prevent event propagation when clicking on author profile
  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate("/team");
  };

  return (
    <article
      className="flex flex-col w-full h-full bg-white shadow-sm hover:shadow-md rounded-md overflow-hidden transition-all border border-gray-100 cursor-pointer"
      onClick={navigateToPost}
    >
      <div className="p-3 sm:p-4 flex-grow">
        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
          <Link
            to={`/blog/category/${post.category}`}
            className="inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rounded-full bg-gray-100 px-2 py-1 hover:bg-gray-200">
              {slugToReadable(post.category) || "Kategori yok"}
            </span>
          </Link>
          <time dateTime={post.createdAt || ""} className="text-gray-500">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Tarih yok"}
          </time>
        </div>

        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-4 mb-2 line-clamp-2">
            <Link
              to={`/blog/post/${post._id}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-primary"
            >
              {post.title || "Başlık yok"}
            </Link>
          </h3>
          <div className="text-gray-600 text-xs sm:text-sm line-clamp-3">
            {finalSummary}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-3 sm:p-4 flex items-center gap-3">
        <img
          alt=""
          src={
            post.author?.profileImage ||
            "https://avatars.githubusercontent.com/u/30373425?v=4"
          }
          className="w-9 h-9 rounded-full border border-gray-200 cursor-pointer hover:opacity-80"
          onClick={handleAuthorClick}
        />
        <div className="text-sm">
          <p
            className="font-medium text-gray-900 cursor-pointer hover:text-primary"
            onClick={handleAuthorClick}
          >
            {post.author?.userName || "Anonim Yazar"}
          </p>
          <p className="text-gray-500 text-xs">
            {post.author?.occupation || "Yazar"}
          </p>
        </div>
      </div>
    </article>
  );
};

export default PostCardComponent;
