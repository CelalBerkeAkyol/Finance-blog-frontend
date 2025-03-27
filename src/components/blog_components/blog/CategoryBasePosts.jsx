// Kategorilere özel kategori sayfası
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByCategory } from "../../../app/features/blogs/postsSlice";
import BlogsSkeleton from "./BlogsSkeleton";
import PostCardComponent from "./PostCardComponent";
import ErrorComponent from "../../error/ErrorComponent";
import { Pagination } from "@nextui-org/react";

export default function CategoryBasePosts() {
  const dispatch = useDispatch();
  const { category } = useParams(); // URL'den kategori parametresi alınıyor
  const [page, setPage] = useState(1);
  const limit = 20;

  // Redux'tan postları alın
  const { posts, isLoading, isError, errorMessage, errorCode, pagination } =
    useSelector((state) => state.posts);

  useEffect(() => {
    if (category) {
      dispatch(fetchPostsByCategory({ category, page, limit }));
    }
  }, [dispatch, category, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return <BlogsSkeleton />;
  }
  if (isError) {
    return (
      <div className="w-full py-8">
        <ErrorComponent
          message={errorMessage}
          code={errorCode}
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
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Başlık ve alt bilgi kısmı */}
        <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 px-4 rounded-lg shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {slugToReadable(category)}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            {slugToReadable(category)} kategorisindeki güncel içeriklerimizi
            keşfedin.
          </p>
        </div>

        {/* Blog yazıları listesi */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {posts &&
              posts.map((post) => (
                <div key={post._id} className="flex">
                  <PostCardComponent post={post} />
                </div>
              ))}
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-4">
            <Pagination
              total={pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showControls
            />
          </div>
        )}
      </div>
    </div>
  );
}
