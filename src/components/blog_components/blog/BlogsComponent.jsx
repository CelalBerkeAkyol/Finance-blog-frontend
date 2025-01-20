// blogların tümünün listelendiği component

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../../app/features/blogs/postsSlice";

export default function BlogsComponent() {
  const dispatch = useDispatch();

  // Redux'tan postları alın
  const { posts, isLoading, isError, errorMessage } = useSelector(
    (state) => state.posts
  );

  // API'den postları çek
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Skeleton bileşeni
  const SkeletonCard = () => (
    <div className="flex max-w-xl flex-col items-start bg-gray-50 mx-4 p-8 rounded-lg animate-pulse">
      {/* Tarih ve Kategori */}
      <div className="flex items-center gap-x-4 text-xs mb-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      {/* Başlık */}
      <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
      {/* İçerik */}
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      {/* Yazar Bilgileri */}
      <div className="relative mt-4 flex items-center gap-x-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  // Yüklenme durumu
  if (isLoading) {
    return (
      <div className="bg-white py-12 sm:py-12 min-h-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Blog
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">
              Güncel içeriklerimizi keşfedin.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-10 sm:mt-12 sm:pt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (isError) {
    return <div>Hata: {errorMessage}</div>;
  }

  // Hiç post bulunamama durumu
  if (!posts || posts.length === 0) {
    return <div>Gösterilecek blog yazısı bulunamadı.</div>;
  }
  function slugToReadable(slug) {
    return slug
      .split("-") // Tireleri kes
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Her kelimenin ilk harfini büyük yap
      .join(" "); // Kelimeleri boşlukla birleştir
  }
  return (
    <div className="bg-white py-12 sm:py-12 min-h-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Blog
          </h1>
          <p className="mt-2 text-lg/8 text-gray-600">
            Güncel içeriklerimizi keşfedin.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-10 sm:mt-12 sm:pt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post._id || `temp-key-${index}`}
              className="flex max-w-xl flex-col items-start bg-gray-50 mx-4 p-8 rounded-lg "
            >
              {/* Tarih ve Kategori */}
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
                  {" "}
                  <span className="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {slugToReadable(post.category) || "Kategori yok"}
                  </span>{" "}
                </Link>
              </div>

              {/* Başlık ve İçerik */}
              <div className="group relative">
                <h3 className="mt-2 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link to={`/blog/post/${post._id}`}>
                    <span className="absolute inset-0" />
                    {post.title || "Başlık yok"}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm/6 text-gray-600">
                  {post.content?.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content || "İçerik yok"}
                </p>
              </div>

              {/* Yazar Bilgileri */}
              <div className="relative mt-4 flex items-center gap-x-4">
                <img
                  alt=""
                  src={
                    post.author?.profileImage ||
                    "https://avatars.githubusercontent.com/u/30373425?v=4"
                  }
                  className="size-10 rounded-full bg-gray-200"
                />
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                    {post.author?.name || "Anonim Yazar"}
                  </p>
                  <p className="text-gray-600">
                    {post.author?.role || "Yazar"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
