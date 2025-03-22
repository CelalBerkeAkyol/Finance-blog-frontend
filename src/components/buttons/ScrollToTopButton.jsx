import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";

const ScrollToTopButton = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Sayfanın en yukarısına çıkma fonksiyonu
  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      // Smooth scroll desteklenmeyen tarayıcılar için fallback
      window.scrollTo(0, 0);
      console.error("Smooth scroll error:", error);
    }
  }, []);

  // Scroll olayını dinleme ve butonun görünürlüğünü kontrol etme
  useEffect(() => {
    let lastScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll yönünü belirle
          const direction = currentScrollTop > lastScrollTop ? "down" : "up";

          // 300px'den fazla scroll yapıldıysa ve yukarı scroll yapılıyorsa butonu göster
          // ya da sayfanın en altına yaklaşıldıysa (sayfayı yüksekliği - görünür alan - 100px)
          const isNearBottom =
            window.innerHeight + currentScrollTop >=
            document.documentElement.scrollHeight - 100;

          setShowScrollButton(
            (currentScrollTop > 300 && direction === "up") || isNearBottom
          );

          lastScrollTop = currentScrollTop;
          ticking = false;
        });

        ticking = true;
      }
    };

    // Farklı tarayıcılar için scroll olayını dinle
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Mobil cihazlar için dokunma olaylarını ekle
      document.addEventListener("touchmove", handleScroll, { passive: true });
      document.addEventListener("touchend", handleScroll, { passive: true });
      document.addEventListener("wheel", handleScroll, { passive: true });

      // İlk sayfa yüklendiğinde hesaplama yap
      handleScroll();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("touchmove", handleScroll);
        document.removeEventListener("touchend", handleScroll);
        document.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-opacity duration-300 ${
        showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-gray-700 hover:bg-gray-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center touch-manipulation"
        aria-label="Sayfanın üstüne git"
        type="button"
      >
        <Icon icon="mdi:arrow-up" width="18" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
