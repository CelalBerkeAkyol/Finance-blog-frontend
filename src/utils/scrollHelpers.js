/**
 * Sayfayı en üste taşıyan yardımcı fonksiyonlar
 */

/**
 * Sayfayı en üste kaydırır
 * @param {Object} options - Kaydırma seçenekleri
 * @param {string} options.behavior - Kaydırma davranışı ('smooth', 'auto' veya 'instant')
 * @param {number} options.delay - Kaydırma işlemi için gecikme (ms)
 * @param {Element} options.element - Kaydırılacak element (varsayılan: window)
 */
export const scrollToTop = (options = {}) => {
  const { behavior = "auto", delay = 0, element = null } = options;

  const scrollTop = () => {
    if (element) {
      // Belirli bir elementi kaydır
      element.scrollTop = 0;
    } else {
      if (behavior === "instant") {
        // Anında kaydırma için scrollTop özelliğini doğrudan kullan
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // Safari için
      } else {
        // Standart kaydırma davranışı
        window.scrollTo({
          top: 0,
          left: 0,
          behavior,
        });
      }
    }
  };

  if (delay > 0) {
    setTimeout(scrollTop, delay);
  } else {
    scrollTop();
  }
};

/**
 * Geçerli URL'yi sayfayı yenilemeden güncelleme (fragment veya hash değişikliklerinde sayfa konumunu değiştirmeden)
 * @param {string} url - Güncellenecek URL
 */
export const updateUrlWithoutScrolling = (url) => {
  if (window.history && window.history.pushState) {
    window.history.pushState(null, document.title, url);
  }
};

/**
 * URL hash'e kaydırma yapar, ancak anında görünürlük için offset ekler
 * @param {string} elementId - Kaydırılacak elementin ID'si (hash etiketi olmadan)
 * @param {number} offset - Kaydırma için piksel cinsinden ofset (varsayılan: 80)
 */
export const scrollToAnchor = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
