// Kategorilere özel kategori sayfası
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByCategory } from "../../../app/features/blogs/postsSlice";
import BlogsSkeleton from "./BlogsSkeleton";
import PostCardComponent from "./PostCardComponent";
import ErrorComponent from "../../error/ErrorComponent";

export default function CategoryBasePosts() {
  const dispatch = useDispatch();
  const { category } = useParams(); // URL'den kategori parametresi alınıyor

  // Redux'tan postları alın
  const { posts, isLoading, isError, errorMessage } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (category) {
      dispatch(fetchPostsByCategory(category));
    }
  }, [dispatch, category]);

  if (isLoading) {
    return <BlogsSkeleton />;
  }
  if (isError) {
    return (
      <div className="w-full py-8">
        <ErrorComponent
          message={errorMessage}
          type="server"
          actionText="Kategorilere Dön"
          onAction={() => (window.location.href = "/blog/categories")}
        />
      </div>
    );
  }

  function slugToReadable(slug) {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="bg-white py-2 mb-12 min-h-full">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Başlık ve alt bilgi kısmı */}
        <div className="mx-auto my-8 lg:mx-0 text-start bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6 px-6 rounded-lg shadow-lg">
          <h1 className="text-pretty text-3xl font-bold sm:text-4xl">
            {slugToReadable(category)}
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            {slugToReadable(category)} kategorisindeki güncel içeriklerimizi
            keşfedin.
          </p>
        </div>

        {/* Blog yazıları listesi */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <PostCardComponent key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
