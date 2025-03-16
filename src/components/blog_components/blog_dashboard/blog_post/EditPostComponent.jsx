// src/components/blog_components/blog_dashboard/blog_post/EditPostComponent.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Card } from "@nextui-org/react";

import CategorySelector from "../helpers/CategorySelector";
import StatusSelector from "../helpers/StatusSelector";
import ImageGalleryModal from "../../image/ImageGalleryModal";

import {
  fetchPostById,
  updatePost,
} from "../../../../app/features/blogs/postsSlice";

const EditPostComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state'den post verilerini ve durum bilgilerini çekiyoruz
  const { posts, isLoading, isError, errorMessage } = useSelector(
    (state) => state.posts
  );

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    status: "taslak",
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
      });
      console.info(
        `EditPostComponent: ${id} ID'li post redux üzerinden getirildi.`
      );
    }
  }, [posts, id]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (selectedCategory) => {
    setPostData({ ...postData, category: selectedCategory });
  };

  const handleStatusChange = (status) => {
    setPostData({ ...postData, status });
  };

  const handleUpdate = async () => {
    try {
      // updatePost thunk'ını dispatch edip, sonucu unwrap ediyoruz
      await dispatch(updatePost({ id, postData })).unwrap();
      navigate("/dashboard/posts");
    } catch (err) {
      console.error("EditPostComponent: Güncelleme hatası:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-full max-w-[80%] p-6 bg-white shadow-lg min-h-screen rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Postu Düzenle</h1>
        {isLoading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : isError ? (
          <p className="text-center text-red-500">{errorMessage}</p>
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
            />
            <Textarea
              name="content"
              label="İçerik"
              fullWidth
              minRows={20}
              maxRows={25}
              value={postData.content}
              onChange={handleChange}
              className="mb-6"
            />

            {/* Kategori, durum ve butonların bulunduğu alan */}
            <div className="flex items-center justify-evenly">
              <CategorySelector
                selectedCategory={postData.category}
                onChange={handleCategoryChange}
              />
              <StatusSelector
                value={postData.status}
                onChange={handleStatusChange}
              />
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
      />
    </div>
  );
};

export default EditPostComponent;
