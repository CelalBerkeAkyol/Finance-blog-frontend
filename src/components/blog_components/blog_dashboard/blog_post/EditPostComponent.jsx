// src/components/blog_components/blog_dashboard/blog_post/EditPostComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react";

import CategorySelector from "../helpers/CategorySelector";
import StatusSelector from "../helpers/StatusSelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";
import { useFeedback } from "../../../../context/FeedbackContext";
import { logError } from "../../../../utils/logger";

import {
  fetchPostById,
  updatePost,
  clearState,
} from "../../../../app/features/blogs/postsSlice";

const EditPostComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert, success, error: showError } = useFeedback();
  const errorShownRef = useRef(false);

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

    // Component unmount olduğunda state'i temizle
    return () => {
      dispatch(clearState());
    };
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

  // Hata mesajı varsa alert göster - refRef kullanarak sonsuz döngüyü engelliyoruz
  useEffect(() => {
    if (isError && errorMessage && !errorShownRef.current) {
      showError(errorMessage);
      errorShownRef.current = true;

      // 3 saniye sonra hata durumunu temizle
      setTimeout(() => {
        dispatch(clearState());
        errorShownRef.current = false;
      }, 3000);
    }
  }, [isError, errorMessage, showError, dispatch]);

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

    try {
      // updatePost thunk'ını dispatch edip, sonucu unwrap ediyoruz
      await dispatch(updatePost({ id, postData })).unwrap();
      success(`"${postData.title}" başlıklı post başarıyla güncellendi.`);
      navigate("/dashboard/posts");
    } catch (err) {
      logError("EditPostComponent", "Güncelleme hatası:", err);
      // Yetki hatası özel durumu
      if (err?.code === "OWNER_OR_ADMIN_REQUIRED") {
        showAlert({
          title: "Yetki Hatası",
          message: "Bu içeriği sadece içerik sahibi veya admin düzenleyebilir.",
          type: "error",
        });
        setTimeout(() => {
          navigate("/dashboard/posts");
        }, 2000);
      } else {
        showError(err?.message || "Post güncellenirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-full max-w-[95%] md:max-w-[90%] p-3 sm:p-4 md:p-6 bg-white shadow-lg min-h-screen rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Postu Düzenle</h1>
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
              className="mb-4 w-full"
              required
              color={errors.title && showErrors ? "danger" : "default"}
              errorMessage={
                errors.title && showErrors ? "Başlık alanı zorunludur" : ""
              }
            />
            <div className="relative mb-4 w-full">
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
                className="w-full"
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
              className="mb-6 w-full"
              required
              color={errors.content && showErrors ? "danger" : "default"}
              errorMessage={
                errors.content && showErrors ? "İçerik alanı zorunludur" : ""
              }
            />

            {/* Kategori, durum ve butonların bulunduğu alan */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="flex flex-col w-full sm:w-auto">
                  <CategorySelector
                    selectedCategory={postData.category}
                    onChange={handleCategoryChange}
                    required
                    isInvalid={errors.category && showErrors}
                    className="w-full"
                  />
                  {errors.category && showErrors && (
                    <span className="text-red-500 text-xs mt-1">
                      Kategori seçimi zorunludur
                    </span>
                  )}
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                  <StatusSelector
                    value={postData.status}
                    onChange={handleStatusChange}
                    required
                    isInvalid={errors.status && showErrors}
                    className="w-full"
                  />
                  {errors.status && showErrors && (
                    <span className="text-red-500 text-xs mt-1">
                      Durum seçimi zorunludur
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onPress={() => setIsGalleryOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Görseller
                </Button>
                <Button
                  onPress={handleUpdate}
                  className="w-full sm:w-auto font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Güncelle
                </Button>
              </div>
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
