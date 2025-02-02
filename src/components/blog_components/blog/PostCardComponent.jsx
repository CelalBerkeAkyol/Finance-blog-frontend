import React from "react";
import { Link } from "react-router-dom";

function slugToReadable(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const PostCardComponent = ({ post }) => {
  const handleView = () => {
    console.info(`PostCardComponent: Post ${post._id} görüntüleniyor.`);
  };

  return (
    <article className="flex max-w-xl flex-col items-start bg-gray-50 mx-4 p-8 rounded-lg">
      <div className="flex items-center gap-x-4 text-xs">
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
          <span className="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
            {slugToReadable(post.category) || "Kategori yok"}
          </span>
        </Link>
      </div>
      <div className="group relative">
        <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          <Link to={`/blog/post/${post._id}`} onClick={handleView}>
            <span className="absolute inset-0" />
            {post.title || "Başlık yok"}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {post.content?.length > 100
            ? post.content.slice(0, 100) + "..."
            : post.content || "İçerik yok"}
        </p>
      </div>
      <div className="relative mt-4 flex items-center gap-x-4">
        <img
          alt=""
          src={
            post.author?.profileImage ||
            "https://avatars.githubusercontent.com/u/30373425?v=4"
          }
          className="size-10 rounded-full bg-gray-200"
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
