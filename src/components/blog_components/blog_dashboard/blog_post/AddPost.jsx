// src/app/features/blog/AddPost.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "../../../../app/features/blogs/postsSlice";
import {
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import CategorySelector from "../helpers/CategorySelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";
import { useFeedback } from "../../../../context/FeedbackContext";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: showError } = useFeedback();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    summary: "",
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    category: false,
    summary: false,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newPostId, setNewPostId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Özet alanı için karakter sayısını güncelle
    if (name === "summary") {
      setCharCount(value.length);
    }

    if (showErrors) {
      setErrors((prev) => ({ ...prev, [name]: !value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tüm alanların dolu olduğunu kontrol et
    const newErrors = {
      title: !formData.title,
      content: !formData.content,
      summary: !formData.summary,
      category: !formData.category,
    };

    setErrors(newErrors);
    setShowErrors(true);

    // Eğer herhangi bir hata varsa, formu gönderme
    if (Object.values(newErrors).some((error) => error)) {
      showError("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsSubmitting(true);

    dispatch(addNewPost(formData))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          success("Yazı başarıyla eklendi!");
          // Yeni postun ID'sini al
          const postId = result.payload?.id || result.payload?._id;
          setNewPostId(postId);

          // Form alanlarını temizle
          setFormData({ title: "", content: "", category: "", summary: "" });
          setShowErrors(false);
          setCharCount(0);

          // Başarı modalını göster
          setShowSuccessModal(true);
        } else {
          showError("Yazı eklenirken bir hata oluştu.");
        }
      })
      .catch((error) => {
        console.error("AddPost: Hata oluştu:", error);
        showError("Yazı eklenirken bir hata oluştu: " + error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCategoryChange = (selectedCategory) => {
    setFormData((prevData) => ({ ...prevData, category: selectedCategory }));
    if (showErrors) {
      setErrors((prev) => ({ ...prev, category: !selectedCategory }));
    }
  };

  const insertImageToContent = (imageUrl) => {
    const markdownImage = `![Resim](${imageUrl})`;
    const textArea = document.querySelector('textarea[name="content"]');

    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = formData.content;
      const newText =
        text.substring(0, start) + markdownImage + text.substring(end);

      setFormData((prevData) => ({ ...prevData, content: newText }));
      success("Görsel içeriğe eklendi!");

      // Textarea'ya odaklan ve imleci doğru pozisyona getir
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(
          start + markdownImage.length,
          start + markdownImage.length
        );
      }, 100);
    } else {
      // Seçili alan yoksa sona ekle
      setFormData((prevData) => ({
        ...prevData,
        content: prevData.content
          ? prevData.content + "\n\n" + markdownImage
          : markdownImage,
      }));
      success("Görsel içeriğe eklendi!");
    }
  };

  // Post görüntüleme sayfasına yönlendir
  const viewPost = () => {
    if (newPostId) {
      navigate(`/blog/post/${newPostId}`);
    }
    setShowSuccessModal(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-full">
      <h2 className="text-xl font-bold mb-4">Yeni Post Ekle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          clearable
          label="Başlık"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          color={errors.title && showErrors ? "danger" : "default"}
          errorMessage={
            errors.title && showErrors ? "Başlık alanı zorunludur" : ""
          }
          className="w-full"
        />
        <div className="relative w-full">
          <Textarea
            clearable
            label="Özet (Maksimum 200 karakter)"
            name="summary"
            maxLength={200}
            minRows={2}
            maxRows={4}
            value={formData.summary}
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
          clearable
          label="İçerik"
          name="content"
          minRows={15}
          maxRows={25}
          onChange={handleChange}
          value={formData.content}
          required
          color={errors.content && showErrors ? "danger" : "default"}
          errorMessage={
            errors.content && showErrors ? "İçerik alanı zorunludur" : ""
          }
          className="w-full"
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <CategorySelector
              selectedCategory={formData.category}
              onChange={handleCategoryChange}
              className="w-full"
              required
              isInvalid={errors.category && showErrors}
            />
            {errors.category && showErrors && (
              <span className="text-red-500 text-xs mt-1">
                Kategori seçimi zorunludur
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Görseller butonu */}
            <Button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="w-full sm:w-auto"
            >
              Görseller
            </Button>
            <Button
              type="submit"
              size="md"
              color="primary"
              variant="solid"
              className="w-full sm:w-auto font-medium bg-primary text-white"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Ekleniyor..." : "Ekle"}
            </Button>
          </div>
        </div>
      </form>

      {/* Modal'ı ekrana getiriyoruz */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={insertImageToContent}
      />

      {/* Başarı Modalı */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Yazı Başarıyla Eklendi
          </ModalHeader>
          <ModalBody>
            <p>Yazınız başarıyla eklendi. Şimdi ne yapmak istersiniz?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="light"
              onPress={() => setShowSuccessModal(false)}
            >
              Kapat
            </Button>
            <Button color="primary" onPress={viewPost}>
              Postu Görüntüle
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddPost;
