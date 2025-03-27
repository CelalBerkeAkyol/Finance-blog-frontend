import { useEffect } from "react";

/**
 * Belirtilen referans dışındaki tıklamaları algılayan hook
 * @param {React.RefObject} ref - İzlenecek DOM elemanına referans
 * @param {Function} handler - Dışarı tıklama olayında çalıştırılacak fonksiyon
 */
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Ref geçersizse veya ref elemanı tıklanan elemanı içeriyorsa bir şey yapma
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    // Mouse tıklaması ve dokunma olaylarını dinle
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      // Temizleme
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
