/**
 * Sayfa navigasyonu sırasında sayfa konumu yönetimi için özel hook
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/scrollHelpers";

/**
 * Sayfa değiştiğinde sayfayı otomatik olarak en üste kaydıran hook
 * @param {Object} options - Hook seçenekleri
 * @param {boolean} options.resetOnPathChange - Path değiştğinde scroll'u resetle (varsayılan: true)
 * @param {boolean} options.resetOnQueryChange - Query değiştğinde scroll'u resetle (varsayılan: false)
 * @param {boolean} options.resetOnHashChange - Hash değiştğinde scroll'u resetle (varsayılan: false)
 * @param {string} options.behavior - Kaydırma davranışı (varsayılan: 'auto')
 */
const usePageNavigation = (options = {}) => {
  const location = useLocation();
  const {
    resetOnPathChange = true,
    resetOnQueryChange = false,
    resetOnHashChange = false,
    behavior = "auto",
  } = options;

  useEffect(() => {
    // Genel bir safety uygulaması
    scrollToTop({ behavior });
  }, []); // Sadece ilk render'da çalış

  // Sayfa değişikliğini izle
  useEffect(() => {
    if (resetOnPathChange) {
      scrollToTop({ behavior });
    }
  }, [location.pathname, resetOnPathChange, behavior]);

  // Query değişikliğini izle (opsiyonel)
  useEffect(() => {
    if (resetOnQueryChange) {
      scrollToTop({ behavior });
    }
  }, [location.search, resetOnQueryChange, behavior]);

  // Hash değişikliğini izle (opsiyonel)
  useEffect(() => {
    if (resetOnHashChange) {
      scrollToTop({ behavior });
    }
  }, [location.hash, resetOnHashChange, behavior]);

  return null;
};

export default usePageNavigation;
