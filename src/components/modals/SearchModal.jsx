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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

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
  const allPosts = useSelector((state) => state.posts.posts);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    // Modal kapandığında arama alanını sıfırlayalım
    if (!isOpen) {
      setSearchTerm("");
      setFilteredPosts([]);
    }
  }, [isOpen]);

  // Arama terimi her değiştiğinde client-side filtre
  useEffect(() => {
    if (!searchTerm) {
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
      // Boyut
      size="lg"
      // Modal içi kaydırma
      scrollBehavior="inside"
    >
      <ModalContent>
        {/* Başlık */}
        <ModalHeader>
          <h2 className="text-xl font-bold">Arama</h2>
        </ModalHeader>

        {/* İçerik */}
        <ModalBody>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Arama terimini girin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              startContent={
                <Icon icon="material-symbols:search" width="20" height="20" />
              }
            />
            <Button color="primary" onPress={() => setSearchTerm("")}>
              Temizle
            </Button>
          </div>

          {/* Sonuçlar */}
          <div className="mt-4">
            {searchTerm && filteredPosts.length === 0 && (
              <p className="text-gray-500">Sonuç bulunamadı</p>
            )}
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/post/${post._id}`}
                onClick={handlePostClick}
                className="block"
              >
                <div className="border rounded-md p-3 mb-3 hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-lg text-blue-800">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-1 mb-2">
                    {post.category && (
                      <Tooltip
                        content={`Kategori: ${slugToReadable(post.category)}`}
                      >
                        <Link
                          to={`/blog/category/${post.category}`}
                          onClick={handleCategoryClick}
                          className="cursor-pointer"
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

                  <div className="text-sm text-gray-600 my-2">
                    {truncateText(post.summary || post.content, 150)}
                  </div>

                  {post.createdAt && (
                    <div className="text-xs text-gray-500 flex items-center mt-2">
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
          <Button color="primary" onPress={onClose}>
            Kapat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
