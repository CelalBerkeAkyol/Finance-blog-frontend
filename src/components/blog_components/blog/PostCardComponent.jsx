import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Kategori isimlerini okunabilir hale getirmek için kullanılıyor
function slugToReadable(slug) {
  if (!slug) return "Kategori Yok";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// İçeriği kısaltan fonksiyon (max 100 karakter)
function truncateText(text, maxLength = 100) {
  if (!text) return "İçerik yok";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const PostCardComponent = ({ post }) => {
  const handleView = () => {
    console.info(`PostCardComponent: Post ${post._id} görüntüleniyor.`);
  };

  return (
    <article className="flex max-w-xl flex-col items-start bg-gray-50 shadow-lg mx-4 p-8 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center gap-x-4 text-xs ">
        <time dateTime={post.createdAt || ""} className="text-gray-500">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Tarih yok"}
        </time>
        <Link to={`/blog/category/${post.category}`}>
          <span className="relative z-10 rounded-full bg-zinc-200 px-3 py-1.5 hover:bg-zinc-300 ">
            {slugToReadable(post.category) || "Kategori yok"}
          </span>
        </Link>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          <Link to={`/blog/post/${post._id}`} onClick={handleView}>
            <span className="absolute inset-0" />
            {truncateText(post.title, 50) || "Başlık yok"}
          </Link>
        </h3>
        <div className="mt-2 text-gray-700 markdown-body text-sm line-clamp-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {truncateText(post.content)}
          </ReactMarkdown>
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-x-4">
        <img
          alt=""
          src={
            post.author?.profileImage ||
            "https://avatars.githubusercontent.com/u/30373425?v=4"
          }
          className="size-10 rounded-full border-2 border-gray-300"
        />
        <div className="text-sm">
          <p className="font-semibold text-gray-900">
            {post.author?.userName || "Anonim Yazar"}
          </p>
          <p className="text-gray-600">{post.author?.role || "Yazar"}</p>
        </div>
      </div>
    </article>
  );
};

export default PostCardComponent;
