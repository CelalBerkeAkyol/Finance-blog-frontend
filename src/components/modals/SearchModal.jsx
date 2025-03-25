// src/components/modals/SearchModal.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import axios from "../../api";
import {
  slugToReadable,
  truncateText,
  formatDate,
} from "../../utils/formatters";

// Custom hook for debounced search
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for search functionality
function useSearch(searchTerm, minChars = 3) {
  const [state, setState] = useState({
    results: [],
    loading: false,
    error: null,
    searched: false,
  });

  const abortControllerRef = useRef(null);

  // Search function - memoized with useCallback
  const performSearch = useCallback(
    async (manualSearch = false) => {
      // Don't search if term is too short
      if (!searchTerm || searchTerm.length < minChars) {
        setState((prev) => ({
          ...prev,
          results: [],
          loading: false,
          error: null,
        }));
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Set loading state
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { data } = await axios.get("/posts/search", {
          params: { query: searchTerm, limit: 20 },
          signal: abortControllerRef.current.signal,
        });

        // Update state with results
        setState({
          results: data?.success ? data.data : [],
          loading: false,
          error: null,
          searched: true,
        });
      } catch (error) {
        // Ignore aborted requests
        if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
          return;
        }

        // Handle network errors
        if (error.isNetworkError) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
            searched: true,
          }));
          return;
        }

        // Handle other errors
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            "Arama yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          results: [],
          searched: true,
        }));

        console.error("Arama hatası:", error);
      }
    },
    [searchTerm, minChars]
  ); // Memoize this function with its dependencies

  // Reset search - memoized with useCallback
  const resetSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      results: [],
      loading: false,
      error: null,
      searched: false,
    });
  }, []); // This function doesn't depend on any props or state

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { ...state, performSearch, resetSearch };
}

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const modalRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const MIN_CHARS = 3;

  const { results, loading, error, searched, performSearch, resetSearch } =
    useSearch(debouncedSearchTerm, MIN_CHARS);

  // Basit bir fokus fonksiyonu oluşturalım
  const focusSearchInput = useCallback(() => {
    if (inputRef.current) {
      // Önce mevcut timeout'u temizleyelim
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }

      // Yeni bir timeout ile focus yapalım (daha güvenilir)
      focusTimeoutRef.current = setTimeout(() => {
        try {
          inputRef.current.focus();
        } catch (e) {
          console.error("Focus error:", e);
        }
      }, 10); // Daha hızlı cevap vermesi için 10ms'ye düşürdüm
    }
  }, []);

  // Handle manual search - memoized to prevent recreation on each render
  const handleManualSearch = useCallback(() => {
    performSearch(true);
    focusSearchInput(); // Aramadan sonra odaklan
  }, [performSearch, focusSearchInput]);

  // Clear search - memoized to prevent recreation on each render
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    resetSearch();
    focusSearchInput(); // Temizledikten sonra odaklan
  }, [resetSearch, focusSearchInput]);

  // Arama input'una sürekli fokuslanmayı sağla
  useEffect(() => {
    if (!isOpen) {
      // Modal kapalıyken işlem yapma
      setSearchTerm("");
      resetSearch();

      // Timeout'u temizle
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      return;
    }

    // Modal açıldığında hemen focus yap
    focusSearchInput();

    // Herhangi bir yere tıklandığında fokus'u input'a geri getir
    const handleDocumentClick = (e) => {
      // Eğer tıklanan öğe input değilse ve modal açıksa
      if (inputRef.current && e.target !== inputRef.current) {
        // Ancak tıklanan element bir buton ise ve link içeriyor mu kontrol et
        const isButton = e.target.closest("button");
        const isLink = e.target.closest("a");

        if (!isButton && !isLink) {
          e.preventDefault(); // Diğer etkileşimleri engelle
          focusSearchInput();
        } else {
          // İşlem tamamlandıktan sonra tekrar focus yap
          setTimeout(focusSearchInput, 100);
        }
      }
    };

    // Herhangi bir tuşa basıldığında fokus'u kontrol et
    const handleKeyDown = () => {
      // Input'a odaklanmamışsa odaklan
      if (document.activeElement !== inputRef.current) {
        focusSearchInput();
      }
    };

    // Otomatik arama sırasında fokus kaybolmasın
    const preventFocusLoss = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        focusSearchInput();
      }
    };

    // Olay dinleyicilerini ekle
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    // Periyodik olarak fokus kontrolü yap
    const focusInterval = setInterval(preventFocusLoss, 100);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(focusInterval);

      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [isOpen, resetSearch, focusSearchInput]);

  // Modal içeriğine referans ayarla
  const handleModalContentRef = (ref) => {
    modalRef.current = ref;
  };

  // Listen for debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= MIN_CHARS) {
      performSearch();
    }
  }, [debouncedSearchTerm, performSearch]);

  // Handle category navigation
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
      <ModalContent ref={handleModalContentRef}>
        <ModalHeader>
          <h2 className="text-xl font-bold">Arama</h2>
        </ModalHeader>

        <ModalBody>
          {/* Search Input */}
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
                        onClick={(e) => {
                          handleManualSearch();
                          // Buton tıklaması sonrası input fokusunu koru
                          setTimeout(focusSearchInput, 0);
                          e.stopPropagation();
                        }}
                        isDisabled={loading}
                      >
                        <Icon icon="material-symbols:search" width="18" />
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={(e) => {
                        clearSearch();
                        // Buton tıklaması sonrası input fokusunu koru
                        setTimeout(focusSearchInput, 0);
                        e.stopPropagation();
                      }}
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
              onBlur={(e) => {
                // Input'tan focus çıkarsa, hemen geri getir
                setTimeout(focusSearchInput, 0);
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

          {/* Results Container */}
          <div className="mt-4">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Spinner color="primary" size="lg" />
                <p className="ml-3 text-gray-600 font-medium">
                  Arama yapılıyor...
                </p>
              </div>
            )}

            {/* Error State */}
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

            {/* Guidance Messages */}
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

            {/* Results List */}
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
                      {/* Post Title */}
                      <h3 className="font-semibold text-base sm:text-lg text-blue-800 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Category and Author */}
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

                      {/* Content Summary */}
                      <div className="text-xs sm:text-sm text-gray-600 my-1 sm:my-2 line-clamp-2 sm:line-clamp-3">
                        {truncateText(post.summary || post.content, 150)}
                      </div>

                      {/* Date */}
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
