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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
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
      return titleMatch || contentMatch;
    });
    setFilteredPosts(results);
  }, [searchTerm, allPosts]);

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
            <Button color="default" onPress={() => setSearchTerm("")}>
              Temizle
            </Button>
          </div>

          {/* Sonuçlar */}
          <div className="mt-4">
            {searchTerm && filteredPosts.length === 0 && (
              <p className="text-gray-500">Sonuç bulunamadı</p>
            )}
            {filteredPosts.map((post) => (
              <div key={post._id} className="border-b py-2">
                <Link to={`/blog/post/${post._id}`} onClick={() => onClose()}>
                  <p className="font-semibold text-blue-800">{post.title}</p>
                </Link>
                <div className="text-sm text-gray-600 line-clamp-2">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Kapat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
