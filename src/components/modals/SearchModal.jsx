// src/components/yardımcılar/SearchModal.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api"; // Axios instance'ınızı import edin
// Format fonksiyonlarını import et
import {
  slugToReadable,
  truncateText,
  formatDate,
} from "../../utils/formatters";

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { posts: reduxPosts, loading: reduxLoading } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const debounceTimer = useRef(null);
  const MIN_CHARS = 3;

  // İsteği iptal et
  const cancelSearch = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
      setLoading(false);
    }
  }, [controller]);

  // Cleanup effect
  useEffect(() => {
    if (!isOpen) {
      setTerm("");
      setResults([]);
      cancelSearch();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    }
    return () => {
      cancelSearch();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [isOpen, cancelSearch]);

  // Arama terimini izle ve debounce ile arama yap
  useEffect(() => {
    if (term.length < MIN_CHARS) {
      setResults([]);
      return;
    }

    // Önceki zamanlayıcıyı temizle
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce: 300ms bekle ve sonra arama yap
    debounceTimer.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [term]);

  // Aramayı gerçekleştir
  const handleSearch = async () => {
    if (term.length < MIN_CHARS) return;

    // Önceki isteği iptal et ve yeni controller oluştur
    cancelSearch();
    const newController = new AbortController();
    setController(newController);
    setLoading(true);

    try {
      const { data } = await axios.get("/posts/search", {
        params: { query: term, limit: 20 },
        signal: newController.signal,
      });

      if (!newController.signal.aborted) {
        setResults(data?.success ? data.data : []);
        setLoading(false);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Arama hatası:", error);
        setResults([]);
        setLoading(false);
      }
    }
  };

  // Kategori sayfasına git
  const goToCategory = (e, category) => {
    e.stopPropagation();
    onClose();
    navigate(`/blog/category/${category}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size={{ "@initial": "full", "@sm": "2xl" }}
      scrollBehavior="inside"
      classNames={{ body: "p-3 md:p-5", base: "max-h-[90vh] sm:max-h-[80vh]" }}
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Arama</h2>
        </ModalHeader>

        <ModalBody>
          {/* Arama alanı */}
          <div className="w-full">
            <Input
              placeholder={`En az ${MIN_CHARS} karakter girin...`}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full"
              autoFocus
              startContent={
                <Icon
                  icon="material-symbols:search"
                  width="18"
                  className="text-gray-400"
                />
              }
              endContent={
                term && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setTerm("");
                      setResults([]);
                    }}
                  >
                    <Icon icon="material-symbols:close" width="18" />
                  </Button>
                )
              }
              disabled={loading}
            />
          </div>

          {/* Sonuçlar */}
          <div className="mt-4">
            {/* Yükleniyor */}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <Spinner color="primary" />
                <p className="ml-2 text-gray-500">Arama yapılıyor...</p>
              </div>
            )}

            {/* Uyarı mesajları */}
            {!loading && (
              <>
                {term && term.length < MIN_CHARS && (
                  <p className="text-gray-500 text-center py-4">
                    Arama için en az {MIN_CHARS} karakter girin
                  </p>
                )}

                {term && term.length >= MIN_CHARS && results.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Sonuç bulunamadı
                  </p>
                )}
              </>
            )}

            {/* Sonuç listesi */}
            {results.map((post) => (
              <Link
                key={post._id}
                to={`/blog/post/${post._id}`}
                onClick={onClose}
                className="block"
              >
                <div className="border rounded-md p-2 sm:p-3 mb-3 hover:bg-gray-50 transition-colors">
                  {/* Başlık */}
                  <h3 className="font-semibold text-base sm:text-lg text-blue-800 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Kategori ve yazar */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 mb-1 sm:mb-2">
                    {post.category && (
                      <Tooltip
                        content={`Kategori: ${slugToReadable(post.category)}`}
                      >
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onClick={(e) => goToCategory(e, post.category)}
                          className="cursor-pointer min-w-0 h-6 px-2"
                          startContent={
                            <Icon icon="material-symbols:category" width="16" />
                          }
                        >
                          {slugToReadable(post.category)}
                        </Button>
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

                  {/* İçerik özeti */}
                  <div className="text-xs sm:text-sm text-gray-600 my-1 sm:my-2 line-clamp-2 sm:line-clamp-3">
                    {truncateText(post.summary || post.content, 150)}
                  </div>

                  {/* Tarih */}
                  {post.createdAt && (
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Icon icon="mdi:calendar" className="mr-1" width="14" />
                      {formatDate(post.createdAt)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ModalBody>

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
