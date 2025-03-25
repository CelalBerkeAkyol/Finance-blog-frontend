import { useState, useRef, useCallback, useEffect } from "react";
import axios from "../api";

/**
 * Arama işlemlerini yöneten custom hook
 * @param {string} searchTerm - Arama terimi
 * @param {number} minChars - Minimum karakter sayısı
 * @returns {Object} - Arama durumu ve fonksiyonları
 */
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
  );

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
  }, []);

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

export default useSearch;
