import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchPostsByCategory } from "../../app/features/blogs/postsSlice";

export default function CategoryBasePosts() {
  const dispatch = useDispatch();
  const { category } = useParams(); // URL’den kategori parametresi alınıyor

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
    return <div>Yükleniyor...</div>;
  }
  if (isError) {
    return <div>Hata: {errorMessage}</div>;
  }
  if (!posts || posts.length === 0) {
    return <div>Bu kategoride gösterilecek blog yazısı bulunamadı.</div>;
  }

  return (
    <div className="bg-white py-12 sm:py-12 min-h-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {category}
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            {category} kategorisindeki güncel içeriklerimizi keşfedin.
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
                <span className="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  {post.category || "Kategori yok"}
                </span>
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
                    "https://via.placeholder.com/50"
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
