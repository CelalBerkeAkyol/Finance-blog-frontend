import { useRef, useCallback, useEffect } from "react";

/**
 * Input alanına otomatik ve sürekli fokus sağlayan hook
 * @returns {Object} - Fokus referansı ve fokus işlevleri
 */
function useFocus() {
  const inputRef = useRef(null);
  const focusTimeoutRef = useRef(null);

  // Basit bir fokus fonksiyonu
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      // Önce mevcut timeout'u temizle
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }

      // Yeni bir timeout ile focus yap (daha güvenilir)
      focusTimeoutRef.current = setTimeout(() => {
        try {
          inputRef.current.focus();
        } catch (e) {
          console.error("Focus error:", e);
        }
      }, 10);
    }
  }, []);

  // Modalı açtığında fokus sağlar veya kapatınca temizlik yapar
  const setupFocusHandlers = useCallback(
    (isOpen) => {
      // Modal kapalıysa timeout'u temizle
      if (!isOpen) {
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        return () => {};
      }

      // Modal açıksa hemen focus yap
      focusInput();

      // Herhangi bir yere tıklandığında fokus'u input'a geri getir
      const handleDocumentClick = (e) => {
        if (inputRef.current && e.target !== inputRef.current) {
          // Eğer tıklanan element bir buton veya link ise
          const isButton = e.target.closest("button");
          const isLink = e.target.closest("a");

          if (!isButton && !isLink) {
            e.preventDefault();
            focusInput();
          } else {
            // İşlem tamamlandıktan sonra tekrar focus yap
            setTimeout(focusInput, 100);
          }
        }
      };

      // Herhangi bir tuşa basıldığında fokus'u kontrol et
      const handleKeyDown = () => {
        if (document.activeElement !== inputRef.current) {
          focusInput();
        }
      };

      // Otomatik arama sırasında fokus kaybolmasın
      const preventFocusLoss = () => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          focusInput();
        }
      };

      // Olay dinleyicilerini ekle
      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleKeyDown);

      // Periyodik olarak fokus kontrolü yap
      const focusInterval = setInterval(preventFocusLoss, 100);

      // Cleanup fonksiyonu
      return () => {
        document.removeEventListener("click", handleDocumentClick);
        document.removeEventListener("keydown", handleKeyDown);
        clearInterval(focusInterval);

        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
      };
    },
    [focusInput]
  );

  // Input blur olduğunda focus'u geri getiren işleyici
  const handleInputBlur = useCallback(
    (e) => {
      setTimeout(focusInput, 0);
    },
    [focusInput]
  );

  // Inputa tıklandığında propagation'ı engelleyen yardımcı fonksiyon
  const handleButtonClick = useCallback(
    (callback) => {
      return (e) => {
        if (callback) callback();
        setTimeout(focusInput, 0);
        e.stopPropagation();
      };
    },
    [focusInput]
  );

  // Temizlik işlemi
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    focusInput,
    setupFocusHandlers,
    handleInputBlur,
    handleButtonClick,
  };
}

export default useFocus;
