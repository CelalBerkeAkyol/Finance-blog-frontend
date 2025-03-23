// src/components/yardımcılar/SearchModal.jsx
import React, { useState, useEffect } from "react";
// DİKKAT: NextUI v2'de Modal ile ilgili alt bileşenleri böyle import ediyoruz
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Chip,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../app/features/blogs/postsSlice";
import { Link } from "react-router-dom";

// Helper functions
const slugToReadable = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function SearchModal({ isOpen, onClose }) {
  // Tüm postlar Redux'ta "posts" slice içinde
  const { posts: allPosts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Modal açıldığında tüm postları çek
  useEffect(() => {
    if (isOpen) {
      // Modal her açıldığında tüm postları çek
      // Tüm postları getirmek için yüksek limit değeri kullanıyoruz
      dispatch(fetchPosts({ page: 1, limit: 1000 }));
      setInitialLoad(false);
    } else {
      // Modal kapandığında arama alanını sıfırlayalım
      setSearchTerm("");
      setFilteredPosts([]);
    }
  }, [isOpen, dispatch]); // allPosts'u bağımlılıklardan kaldırıldı

  // Arama terimi her değiştiğinde client-side filtre
  useEffect(() => {
    if (!searchTerm || !allPosts) {
      setFilteredPosts([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = allPosts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(term);
      const contentMatch = post.content?.toLowerCase().includes(term);
      const categoryMatch = post.category?.toLowerCase().includes(term);
      const summaryMatch = post.summary?.toLowerCase().includes(term);
      const authorMatch = post.author?.name?.toLowerCase().includes(term);

      return (
        titleMatch ||
        contentMatch ||
        categoryMatch ||
        summaryMatch ||
        authorMatch
      );
    });
    setFilteredPosts(results);
  }, [searchTerm, allPosts]);

  const handlePostClick = () => {
    onClose();
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      // NextUI v2: onClose yerine onOpenChange
      onOpenChange={onClose}
      // Boyut - mobil/tablet/masaüstü için responsive
      size={{
        "@initial": "full", // Mobil için tam ekran
        "@sm": "lg", // Tablet ve üstü için normal modal
      }}
      // Modal içi kaydırma
      scrollBehavior="inside"
      classNames={{
        body: "p-3 md:p-5", // Mobilde daha az padding
        base: "max-h-[90vh] sm:max-h-[80vh]", // Mobilde daha fazla yükseklik
      }}
    >
      <ModalContent>
        {/* Başlık */}
        <ModalHeader>
          <h2 className="text-xl font-bold">Arama</h2>
        </ModalHeader>

        {/* İçerik */}
        <ModalBody>
          {/* Arama alanı - Mobilde Dikey, Masaüstünde Yatay */}
          <div className="flex flex-row gap-2 items-center">
            <Input
              type="text"
              placeholder="Arama terimini girin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              size="md"
              startContent={
                <Icon
                  icon="material-symbols:search"
                  width="18"
                  height="18"
                  className="text-gray-400"
                />
              }
              endContent={
                searchTerm &&
                !loading && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setSearchTerm("")}
                    className="bg-transparent"
                  >
                    <Icon
                      icon="material-symbols:close"
                      width="18"
                      height="18"
                    />
                  </Button>
                )
              }
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Sonuçlar */}
          <div className="mt-4">
            {/* Yükleme durumu */}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <Spinner color="primary" />
                <p className="ml-2 text-gray-500">Arama yapılıyor...</p>
              </div>
            )}

            {/* Sonuç bulunamadı */}
            {!loading && searchTerm && filteredPosts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Sonuç bulunamadı</p>
            )}

            {/* Sonuç listesi - Yüklenirken önceki sonuçlar soluk gösterilir */}
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/post/${post._id}`}
                onClick={handlePostClick}
                className={`block ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="border rounded-md p-2 sm:p-3 mb-3 hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-base sm:text-lg text-blue-800 line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 mb-1 sm:mb-2">
                    {post.category && (
                      <Tooltip
                        content={`Kategori: ${slugToReadable(post.category)}`}
                        delay={500}
                      >
                        <Link
                          to={`/blog/category/${post.category}`}
                          onClick={handleCategoryClick}
                          className={`cursor-pointer ${
                            loading ? "pointer-events-auto" : ""
                          }`}
                        >
                          <Chip
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={
                              <Icon
                                icon="material-symbols:category"
                                width="16"
                              />
                            }
                          >
                            {slugToReadable(post.category)}
                          </Chip>
                        </Link>
                      </Tooltip>
                    )}

                    {post.author?.name && (
                      <Chip
                        size="sm"
                        color="secondary"
                        variant="flat"
                        startContent={<Icon icon="mdi:account" width="16" />}
                      >
                        {post.author.name}
                      </Chip>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600 my-1 sm:my-2 line-clamp-2 sm:line-clamp-3">
                    {truncateText(
                      post.summary || post.content,
                      window.innerWidth < 640 ? 100 : 150
                    )}
                  </div>

                  {post.createdAt && (
                    <div className="text-xs text-gray-500 flex items-center mt-1 sm:mt-2">
                      <Icon icon="mdi:calendar" className="mr-1" width="14" />
                      {formatDate(post.createdAt)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            className="rounded-full"
            size="sm"
            variant="flat"
          >
            Kapat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
