import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../app/features/blogs/postsSlice";
import BlogsSkeleton from "./BlogsSkeleton";
import ServerErrorComponent from "../../uyarılar/ServerErrorComponent";
import PostCardComponent from "./PostCardComponent"; // Yeni bileşeni import ettik

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

  // Yüklenme durumu
  if (isLoading) {
    return <BlogsSkeleton />;
  }

  // Hata durumu
  if (isError) {
    return <ServerErrorComponent message={errorMessage} />;
  }

  // Hiç post bulunamama durumu
  if (!posts || posts.length === 0) {
    return <div>Gösterilecek blog yazısı bulunamadı.</div>;
  }

  return (
    <div className="bg-white py-2 mb-12 min-h-full">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto lg:mx-0 text-start bg-gradient-to-r py-4">
          <h1 className="text-pretty text-2xl font-semibold  sm:text-4xl">
            Blog
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Güncel içeriklerimizi keşfedin.
          </p>
        </div>

        {/* Blog Kartları */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <PostCardComponent key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
