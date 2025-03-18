import React from "react";
import { Alert, Button } from "@nextui-org/react";

/**
 * Generic Error Component that can handle different types of errors
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {string} props.title - The title of the error alert
 * @param {string} props.code - Error code (optional)
 * @param {string} props.type - Error type: 'server', 'auth', 'notFound', 'validation', 'custom'
 * @param {string} props.color - Alert color: 'danger', 'warning', 'success', 'primary', 'secondary'
 * @param {React.ReactNode} props.icon - Custom icon to display
 * @param {function} props.onAction - Callback function for action button
 * @param {string} props.actionText - Text for the action button
 * @param {function} props.onBack - Callback when back button is clicked
 * @returns {React.ReactNode}
 */
export default function ErrorComponent({
  message = "Beklenmeyen bir hata oluştu.",
  title,
  code,
  type = "custom",
  color = "danger",
  icon,
  onAction,
  actionText = "Tekrar Dene",
  onBack = () => window.history.back(),
}) {
  // Set default title based on error type if not provided
  if (!title) {
    switch (type) {
      case "server":
        title = "Sunucu Hatası";
        break;
      case "auth":
        title = "Yetkilendirme Hatası";
        break;
      case "notFound":
        title = "Sayfa Bulunamadı";
        break;
      case "validation":
        title = "Doğrulama Hatası";
        break;
      default:
        title = "Hata";
    }
  }

  // Default icon based on type
  const getDefaultIcon = () => {
    switch (type) {
      case "server":
        return "🖥️";
      case "auth":
        return "🔒";
      case "notFound":
        return "🔍";
      case "validation":
        return "⚠️";
      default:
        return "❌";
    }
  };

  // Construct error message with code if present
  const fullMessage = code ? `${message} (Kod: ${code})` : message;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <Alert
        color={color}
        title={title}
        description={fullMessage}
        icon={icon || getDefaultIcon()}
        className="mb-4 w-full"
      />

      <div className="flex gap-3 mt-4">
        {onAction && (
          <Button
            color={color === "danger" ? "primary" : color}
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}

        <Button variant="ghost" onClick={onBack}>
          Geri Dön
        </Button>
      </div>
    </div>
  );
}
