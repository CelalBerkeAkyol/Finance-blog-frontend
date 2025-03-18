// src/components/blog_components/blog_dashboard/blog_post/EditPostComponent.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react";

import CategorySelector from "../helpers/CategorySelector";
import StatusSelector from "../helpers/StatusSelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";
import { useFeedback } from "../../../../context/FeedbackContext";

import {
  fetchPostById,
  updatePost,
} from "../../../../app/features/blogs/postsSlice";

const EditPostComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert, success, error: showError } = useFeedback();

  // Redux state'den post verilerini ve durum bilgilerini çekiyoruz
  const { posts, isLoading, isError, errorMessage } = useSelector(
    (state) => state.posts
  );

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    status: "taslak",
    summary: "",
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    category: false,
    status: false,
    summary: false,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Component yüklendiğinde ilgili postu redux üzerinden getiriyoruz
  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  // Redux store'dan gelen posts dizisi içerisinde, ilgili post bulunduğunda yerel state'i güncelliyoruz
  useEffect(() => {
    const post = posts.find((p) => p._id === id);
    if (post) {
      setPostData({
        title: post.title || "",
        content: post.content || "",
        category: post.category || "kategori-yok",
        status: post.status || "taslak",
        summary: post.summary || "",
      });
      // İlk yüklemede karakter sayısını ayarla
      setCharCount(post.summary?.length || 0);
    }
  }, [posts, id]);

  // Hata mesajı varsa alert göster
  useEffect(() => {
    if (isError && errorMessage) {
      showError(errorMessage);
    }
  }, [isError, errorMessage, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });

    // Özet alanı için karakter sayısını güncelle
    if (name === "summary") {
      setCharCount(value.length);
    }

    if (showErrors) {
      setErrors((prev) => ({ ...prev, [name]: !value }));
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setPostData({ ...postData, category: selectedCategory });
    if (showErrors) {
      setErrors((prev) => ({ ...prev, category: !selectedCategory }));
    }
  };

  const handleStatusChange = (status) => {
    setPostData({ ...postData, status });
    if (showErrors) {
      setErrors((prev) => ({ ...prev, status: !status }));
    }
  };

  const handleUpdate = async () => {
    // Tüm alanların dolu olduğunu kontrol et
    const newErrors = {
      title: !postData.title,
      content: !postData.content,
      summary: !postData.summary,
      category: !postData.category,
      status: !postData.status,
    };

    setErrors(newErrors);
    setShowErrors(true);

    if (Object.values(newErrors).some((error) => error)) {
      showAlert({
        title: "Hata",
        message: "Lütfen tüm alanları doldurun.",
        type: "error",
      });
      return;
    }

    try {
      // updatePost thunk'ını dispatch edip, sonucu unwrap ediyoruz
      await dispatch(updatePost({ id, postData })).unwrap();
      success(`"${postData.title}" başlıklı post başarıyla güncellendi.`);
      navigate("/dashboard/posts");
    } catch (err) {
      console.error("EditPostComponent: Güncelleme hatası:", err);
      showError(err?.message || "Post güncellenirken bir hata oluştu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-full max-w-[80%] p-6 bg-white shadow-lg min-h-screen rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Postu Düzenle</h1>
        {isLoading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : (
          <>
            <Input
              type="text"
              name="title"
              label="Başlık"
              fullWidth
              value={postData.title}
              onChange={handleChange}
              className="mb-4"
              required
              color={errors.title && showErrors ? "danger" : "default"}
              errorMessage={
                errors.title && showErrors ? "Başlık alanı zorunludur" : ""
              }
            />
            <div className="relative mb-4">
              <Textarea
                name="summary"
                label="Özet (Maksimum 200 karakter)"
                fullWidth
                maxLength={200}
                minRows={2}
                maxRows={4}
                value={postData.summary}
                onChange={handleChange}
                placeholder="Yazınızın kısa bir özetini girin (maksimum 200 karakter)"
                required
                color={errors.summary && showErrors ? "danger" : "default"}
                errorMessage={
                  errors.summary && showErrors ? "Özet alanı zorunludur" : ""
                }
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {charCount}/200
              </div>
            </div>
            <Textarea
              name="content"
              label="İçerik"
              fullWidth
              minRows={20}
              maxRows={25}
              value={postData.content}
              onChange={handleChange}
              className="mb-6"
              required
              color={errors.content && showErrors ? "danger" : "default"}
              errorMessage={
                errors.content && showErrors ? "İçerik alanı zorunludur" : ""
              }
            />

            {/* Kategori, durum ve butonların bulunduğu alan */}
            <div className="flex items-center justify-evenly">
              <div className="flex flex-col">
                <CategorySelector
                  selectedCategory={postData.category}
                  onChange={handleCategoryChange}
                  required
                  isInvalid={errors.category && showErrors}
                />
                {errors.category && showErrors && (
                  <span className="text-red-500 text-xs mt-1">
                    Kategori seçimi zorunludur
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <StatusSelector
                  value={postData.status}
                  onChange={handleStatusChange}
                  required
                  isInvalid={errors.status && showErrors}
                />
                {errors.status && showErrors && (
                  <span className="text-red-500 text-xs mt-1">
                    Durum seçimi zorunludur
                  </span>
                )}
              </div>

              <Button onClick={() => setIsGalleryOpen(true)}>Görseller</Button>
              <Button color="primary" onClick={handleUpdate}>
                Güncelle
              </Button>
            </div>
          </>
        )}
      </Card>
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(imageUrl) => {
          // Seçilen görsel URL'ini içeriğe ekle
          const imageMarkdown = `\n![Resim](${imageUrl})\n`;
          setPostData({
            ...postData,
            content: postData.content + imageMarkdown,
          });
          success("Görsel içeriğe eklendi!");
        }}
      />
    </div>
  );
};

export default EditPostComponent;
