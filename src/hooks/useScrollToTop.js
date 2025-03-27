// Hook: useScrollToTop - Sayfayı en üste kaydırmak için özel hook
import { useEffect } from "react";

/**
 * Sayfayı en üste kaydırmak için özel hook
 * @param {any} dependency - Bu değer değiştiğinde sayfa en üste kayacak
 * @param {object} options - Konfigürasyon seçenekleri
 * @param {string} options.behavior - Kaydırma davranışı ('auto' veya 'smooth')
 * @param {number} options.delay - Kaydırma işlemini geciktirme (ms)
 */
const useScrollToTop = (dependency, options = {}) => {
  const { behavior = "smooth", delay = 0 } = options;

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [dependency, behavior, delay]);
};

export default useScrollToTop;
