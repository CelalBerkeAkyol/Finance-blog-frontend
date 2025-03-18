import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";

/**
 * Geçici bildirimler için Toast bileşeni
 * @param {Object} props
 * @param {string} props.message - Görüntülenecek bildirim mesajı
 * @param {string} props.type - Bildirim tipi: 'error', 'warning', 'success', 'info'
 * @param {number} props.duration - Bildirimin ekranda kalma süresi (ms cinsinden)
 * @param {function} props.onClose - Bildirim kapandığında çağrılacak fonksiyon
 * @param {boolean} props.showCloseButton - Kapatma butonu görünsün mü
 * @returns {React.ReactNode}
 */
export default function ToastComponent({
  message,
  type = "success",
  duration = 3000,
  onClose,
  showCloseButton = true,
}) {
  // Bildirim tiplerine göre renk sınıfları
  const colorClasses = {
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
  };

  // Geçersiz tip için varsayılan renk
  const colorClass = colorClasses[type] || colorClasses.info;

  // Bildirim ikonları
  const icons = {
    error: "❌",
    warning: "⚠️",
    success: "✅",
    info: "ℹ️",
  };

  // Otomatik kapanma için zamanlayıcı
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 min-w-[250px] ${colorClass} animate-fadeIn flex items-center justify-between`}
    >
      <div className="flex items-center">
        <span className="mr-2">{icons[type]}</span>
        <span>{message}</span>
      </div>

      {showCloseButton && (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="ml-2 text-white bg-transparent"
          onClick={onClose}
        >
          ✕
        </Button>
      )}
    </div>
  );
}

// CSS animasyon için tailwind.config.js'ye şu extend'i ekleyin:
// extend: {
//   keyframes: {
//     fadeIn: {
//       '0%': { opacity: 0, transform: 'translateY(10px)' },
//       '100%': { opacity: 1, transform: 'translateY(0)' },
//     },
//   },
//   animation: {
//     fadeIn: 'fadeIn 0.3s ease-out',
//   },
// }
