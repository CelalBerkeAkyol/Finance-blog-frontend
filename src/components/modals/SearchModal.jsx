// src/components/modals/SearchModal.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input, Button, Chip, Tooltip, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { slugToReadable, formatDate } from "../../utils/formatters";

// Custom hooks
import useDebounce from "../../hooks/useDebounce";
import useSearch from "../../hooks/useSearch";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

/**
 * Özel Arama bileşeni
 */
export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const MIN_CHARS = 3;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Dışarı tıklandığında kapatma
  useOnClickOutside(modalRef, onClose);

  // Custom hook'ları kullan
  const { results, loading, error, searched, performSearch, resetSearch } =
    useSearch(debouncedSearchTerm, MIN_CHARS);

  // Body scroll'u kilitle
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Modal açıldığında input'a odaklan
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Arama ve temizleme işlemleri
  const handleManualSearch = useCallback(() => {
    if (searchTerm.length >= MIN_CHARS) {
      performSearch(true);
    }
  }, [performSearch, searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    resetSearch();
  }, [resetSearch]);

  // Modal kapatıldığında temizle
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      resetSearch();
    }
  }, [isOpen, resetSearch]);

  // Arama terimini izle
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= MIN_CHARS) {
      performSearch();
    }
  }, [debouncedSearchTerm, performSearch, MIN_CHARS]);

  // Kategori sayfasına yönlendirme
  const goToCategory = (e, category) => {
    e.stopPropagation();
    onClose();
    navigate(`/blog/category/${category}`);
  };

  if (!isOpen) return null;

  // Portal ile body sonuna render et
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-hidden">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] max-h-[90vh] mt-16 flex flex-col overflow-hidden animate-fade-in-down"
        style={{
          animation: "0.2s ease-out 0s 1 normal forwards running fadeInDown",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Arama</h2>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={onClose}
            className="hover:bg-gray-100"
          >
            <Icon icon="material-symbols:close" width={20} />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Arama Input'u */}
          <div className="w-full sticky top-0 bg-white pt-2 pb-3 z-10">
            <Input
              ref={inputRef}
              placeholder={`En az ${MIN_CHARS} karakter girin...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full"
              startContent={
                <Icon
                  icon="material-symbols:search"
                  width="18"
                  className="text-gray-400"
                />
              }
              endContent={
                searchTerm && (
                  <div className="flex gap-1 items-center">
                    {searchTerm.length >= MIN_CHARS && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        isIconOnly
                        onClick={handleManualSearch}
                        isDisabled={loading}
                      >
                        <Icon icon="material-symbols:search" width="18" />
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={clearSearch}
                    >
                      <Icon icon="material-symbols:close" width="18" />
                    </Button>
                  </div>
                )
              }
              disabled={loading}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  searchTerm.length >= MIN_CHARS &&
                  !loading
                ) {
                  e.preventDefault();
                  handleManualSearch();
                }
              }}
              description={
                searchTerm.length > 0 && searchTerm.length < MIN_CHARS
                  ? `En az ${MIN_CHARS} karakter girmelisiniz (${
                      MIN_CHARS - searchTerm.length
                    } karakter daha)`
                  : "Enter tuşuna basarak arama yapabilirsiniz."
              }
            />
          </div>

          {/* Sonuçlar Bölümü */}
          <div className="mt-2">
            {/* Yükleniyor Durumu */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Spinner color="primary" size="lg" />
                <p className="ml-3 text-gray-600 font-medium">
                  Arama yapılıyor...
                </p>
              </div>
            )}

            {/* Hata Durumu */}
            {!loading && error && (
              <div className="text-center py-4 border border-red-200 rounded-lg bg-red-50 shadow-sm">
                <Icon
                  icon="material-symbols:error"
                  className="w-10 h-10 mx-auto text-red-500 mb-2"
                />
                <p className="text-red-700 font-medium">{error}</p>
                <Button
                  color="primary"
                  size="sm"
                  className="mt-3"
                  onClick={handleManualSearch}
                >
                  Tekrar Dene
                </Button>
              </div>
            )}

            {/* Yönlendirme Mesajları */}
            {!loading && !error && (
              <>
                {searchTerm && searchTerm.length < MIN_CHARS && (
                  <p className="text-gray-500 text-center py-4">
                    Arama için en az {MIN_CHARS} karakter girin
                  </p>
                )}

                {searchTerm &&
                  searchTerm.length >= MIN_CHARS &&
                  searched &&
                  results.length === 0 && (
                    <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                      <Icon
                        icon="material-symbols:search-off"
                        className="w-12 h-12 mx-auto text-gray-400 mb-3"
                      />
                      <p className="text-gray-700 font-medium mb-2">
                        Aradığınız içerik bulunamadı
                      </p>
                      <p className="text-gray-500 text-sm px-4 mb-3">
                        Farklı anahtar kelimeler kullanarak yeniden arama
                        yapabilirsiniz.
                      </p>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handleManualSearch}
                        startContent={
                          <Icon icon="material-symbols:search" width="16" />
                        }
                      >
                        Tekrar Ara
                      </Button>
                    </div>
                  )}
              </>
            )}

            {/* Sonuç Listesi */}
            {results.length > 0 && (
              <div className="mt-2">
                {results.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/post/${post._id}`}
                    onClick={onClose}
                    className="block"
                  >
                    <div className="border rounded-md p-3 mb-3 hover:bg-gray-50 transition-colors">
                      {/* Post Başlığı */}
                      <h3 className="font-semibold text-base sm:text-lg text-blue-800 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Kategori ve Yazar */}
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {post.category && (
                          <Tooltip
                            content={`Kategori: ${slugToReadable(
                              post.category
                            )}`}
                          >
                            <Chip
                              size="sm"
                              color="primary"
                              variant="flat"
                              radius="sm"
                              className="cursor-pointer"
                              onClick={(e) => goToCategory(e, post.category)}
                            >
                              {slugToReadable(post.category)}
                            </Chip>
                          </Tooltip>
                        )}

                        {post.author && post.author.name && (
                          <Tooltip content="Yazar">
                            <Chip size="sm" variant="flat" radius="sm">
                              {post.author.name}
                            </Chip>
                          </Tooltip>
                        )}

                        {post.publishedAt && (
                          <Tooltip content="Yayınlanma Tarihi">
                            <Chip size="sm" variant="flat" radius="sm">
                              {formatDate(post.publishedAt)}
                            </Chip>
                          </Tooltip>
                        )}
                      </div>

                      {/* İçerik Önizleme */}
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
