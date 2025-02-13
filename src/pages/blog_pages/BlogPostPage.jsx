import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import TableOfContents from "../../components/blog_components/blog/TableOfContents";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";
import BlogPostSkeleton from "../../components/blog_components/blog/BlogPostSkeleton";
import TableSkeleton from "../../components/blog_components/blog/TableSkeleton";

import { useDispatch } from "react-redux";
import { incrementPostView } from "../../app/features/blogs/postsSlice";
function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Geçersiz post id");
      setLoading(false);
      return;
    }

    api
      .get(`/posts/one-post/${id}`)
      .then((response) => {
        setPost(response.data.post);
      })
      .catch(() => {
        setError("Blog yazısı yüklenirken hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (post && post._id) {
      // Post yüklendikten sonra 1 kere views'i artır
      dispatch(incrementPostView(post._id));
    }
  }, [post, dispatch]);

  // Eğer bir hata varsa, isterseniz content kısmında gösterebilirsiniz.
  // Ama header/footer yine görünür kalsın.
  // Örnekte "error" durumunu content alanında göstereceğim.
  return (
    <div className="flex flex-col">
      {/* Üst kısım her zaman görünüyor */}
      <BannerComponent />
      <CustomNavbar />

      <div className="flex flex-col md:flex-row gap-8 py-8 container">
        {/* Sol kolon (içindekiler) */}
        <div className="md:w-[25%] w-full border-r min-w-[20%]">
          <div className="sticky top-20 overflow-y-auto">
            {/* İçindekiler, post varsa ve yükleme bitmişse göster */}

            {loading ? (
              <TableSkeleton />
            ) : (
              <TableOfContents content={post.content} />
            )}
          </div>
        </div>

        {/* Sağ kolon (asıl blog içeriği) */}
        <div className="md:w-[70%] w-full margin-auto px-4">
          {loading ? (
            // Yükleme durumunda sadece blog içeriği yerine skeleton
            <BlogPostSkeleton />
          ) : error ? (
            // Hata mesajı
            <div className="text-red-600">{error}</div>
          ) : (
            // Yükleme bitti ve hata yoksa gerçek içerik
            <BlogPostComponent post={post} />
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
