import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

function slugToReadable(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const BlogPostComponent = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="prose p-4 text-start min-w-full">
      <h1 className=" mb-4">{post.title}</h1>
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
      <div className="overflow-x-auto pt-6">
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
