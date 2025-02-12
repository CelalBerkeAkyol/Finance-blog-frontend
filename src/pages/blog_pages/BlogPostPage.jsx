import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import TableOfContents from "../../components/blog_components/blog/TableOfContents";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

// Bütün blog içerikleri buraya gelecek
function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // TO DO veriler apiden geliyor fakat reduxta var zaten bunu oradan almak mantıklı olur
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
      .catch((err) => {
        setError("Blog yazısı yüklenirken hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col">
      <BannerComponent />
      <CustomNavbar />

      {/* Ana kapsayıcı: geniş ekranda iki kolonlu, mobile için üst üste */}
      <div className="flex flex-col md:flex-row gap-8 py-8 container ">
        {/* Sol Kolon: İçindekiler */}
        <div className="md:w-[25%] w-full border-r min-w-[20%]">
          {/* 
            sticky ve overflow özellikleri:
            - sticky: ekranda sabit kalması
            - top-20 (veya kendi navbar yüksekliğinize göre) yukarıdan boşluk
            - h-[calc(100vh-5rem)] gibi bir yükseklik ayarıyla içerik sığmazsa scroll
          */}
          <div className="sticky top-20  overflow-y-auto">
            <TableOfContents content={post.content} />
          </div>
        </div>

        {/* Sağ Kolon: Blog içeriği */}
        <div className="md:w-[70%] w-full margin-auto px-4">
          <BlogPostComponent post={post} />
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
