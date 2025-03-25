// src/components/modals/SearchModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
  Chip,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import {
  slugToReadable,
  truncateText,
  formatDate,
} from "../../utils/formatters";

// Custom hooks
import useDebounce from "../../hooks/useDebounce";
import useSearch from "../../hooks/useSearch";
import useFocus from "../../hooks/useFocus";

/**
 * Arama modalı bileşeni
 * @param {boolean} isOpen - Modalın açık olup olmadığı
 * @param {function} onClose - Modal kapatma fonksiyonu
 */
export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const MIN_CHARS = 3;

  // Custom hook'ları kullan
  const { results, loading, error, searched, performSearch, resetSearch } =
    useSearch(debouncedSearchTerm, MIN_CHARS);

  const {
    inputRef,
    focusInput,
    setupFocusHandlers,
    handleInputBlur,
    handleButtonClick,
  } = useFocus();

  // Arama ve temizleme işlemleri
  const handleManualSearch = useCallback(() => {
    performSearch(true);
    focusInput();
  }, [performSearch, focusInput]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    resetSearch();
    focusInput();
  }, [resetSearch, focusInput]);

  // Modal açık/kapalı durum kontrolü ve focus yönetimi
  useEffect(() => {
    // Modal kapandığında arama işlemini sıfırla
    if (!isOpen) {
      setSearchTerm("");
      resetSearch();
    }

    // Focus yönetimi için kurulumu yap
    return setupFocusHandlers(isOpen);
  }, [isOpen, resetSearch, setupFocusHandlers]);

  // Debouce'lu arama terimini izle
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size={{ "@initial": "full", "@sm": "3xl", "@md": "4xl", "@lg": "5xl" }}
      scrollBehavior="inside"
      classNames={{
        body: "p-3 md:p-5",
        base: "max-h-[90vh] sm:max-h-[80vh] max-w-full sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Arama</h2>
        </ModalHeader>

        <ModalBody>
          {/* Arama Input'u */}
          <div className="w-full">
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
                        onClick={handleButtonClick(handleManualSearch)}
                        isDisabled={loading}
                      >
                        <Icon icon="material-symbols:search" width="18" />
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={handleButtonClick(clearSearch)}
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
              onBlur={handleInputBlur}
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
          <div className="mt-4">
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
                  onClick={handleButtonClick(handleManualSearch)}
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
                        onClick={handleButtonClick(handleManualSearch)}
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
                    <div className="border rounded-md p-2 sm:p-3 mb-3 hover:bg-gray-50 transition-colors">
                      {/* Post Başlığı */}
                      <h3 className="font-semibold text-base sm:text-lg text-blue-800 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Kategori ve Yazar */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 mb-1 sm:mb-2">
                        {post.category && (
                          <Tooltip
                            content={`Kategori: ${slugToReadable(
                              post.category
                            )}`}
                          >
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={(e) => goToCategory(e, post.category)}
                              className="cursor-pointer min-w-0 h-6 px-2"
                              startContent={
                                <Icon
                                  icon="material-symbols:category"
                                  width="16"
                                />
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
                            startContent={
                              <Icon icon="mdi:account" width="16" />
                            }
                          >
                            {post.author.name}
                          </Chip>
                        )}
                      </div>

                      {/* İçerik Özeti */}
                      <div className="text-xs sm:text-sm text-gray-600 my-1 sm:my-2 line-clamp-2 sm:line-clamp-3">
                        {truncateText(post.summary || post.content, 150)}
                      </div>

                      {/* Tarih */}
                      {post.createdAt && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Icon
                            icon="mdi:calendar"
                            className="mr-1"
                            width="14"
                          />
                          {formatDate(post.createdAt)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
