import React from "react";
import { Alert, Button } from "@nextui-org/react";

/**
 * Farklı türlerde uyarılar gösterebilen genel uyarı bileşeni
 * @param {Object} props
 * @param {string} props.message - Görüntülenecek uyarı mesajı
 * @param {string} props.title - Uyarı başlığı
 * @param {string} props.code - Hata kodu (isteğe bağlı)
 * @param {string} props.type - Uyarı tipi: 'error', 'warning', 'success', 'info'
 * @param {function} props.onAction - Aksiyon butonu için geri çağırma işlevi
 * @param {string} props.actionText - Aksiyon butonu metni
 * @param {function} props.onClose - Kapatma butonu için geri çağırma işlevi
 * @param {boolean} props.showCloseButton - Kapatma butonu gösterilsin mi
 * @returns {React.ReactNode}
 */
export default function AlertComponent({
  message = "Bir uyarı mesajı var.",
  title,
  code,
  type = "info", // error, warning, success, info
  onAction,
  actionText = "Tamam",
  onClose,
  showCloseButton = true,
}) {
  // Next UI'daki renk karşılıkları
  const colorMap = {
    error: "danger",
    warning: "warning",
    success: "success",
    info: "primary",
  };

  // Tip belirtilmemişse veya geçersizse varsayılan renk
  const color = colorMap[type] || "primary";

  // Uyarı tipi temelinde varsayılan başlık
  if (!title) {
    switch (type) {
      case "error":
        title = "Hata";
        break;
      case "warning":
        title = "Uyarı";
        break;
      case "success":
        title = "Başarılı";
        break;
      case "info":
      default:
        title = "Bilgi";
    }
  }

  // Kod varsa mesaja ekle
  const fullMessage = code ? `${message} (Kod: ${code})` : message;

  return (
    <div className="flex flex-col w-full">
      <Alert
        color={color}
        title={title}
        description={fullMessage}
        className="mb-4 w-full"
      />

      {(onAction || showCloseButton) && (
        <div className="flex gap-3 mt-2 justify-end">
          {onAction && (
            <Button color={color} onPress={onAction}>
              {actionText}
            </Button>
          )}

          {showCloseButton && (
            <Button variant="light" onPress={onClose}>
              Kapat
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
