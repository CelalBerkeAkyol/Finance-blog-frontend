import React from "react";
import { Alert, Button } from "@nextui-org/react";

/**
 * Generic Error Component that can handle different types of errors
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {string} props.title - The title of the error alert
 * @param {string} props.code - Error code (optional)
 * @param {string} props.type - Error code from backend: 'NOT_FOUND', 'INTERNAL_SERVER_ERROR', etc.
 * @param {string} props.color - Alert color: 'danger', 'warning', 'success', 'primary', 'primary'
 * @param {function} props.onAction - Callback function for action button
 * @param {string} props.actionText - Text for the action button
 * @param {function} props.onBack - Callback when back button is clicked
 * @returns {React.ReactNode}
 */
export default function ErrorComponent({
  message = "Beklenmeyen bir hata oluştu.",
  title,
  code,
  color = "warning",
  onAction,
  actionText = "Tekrar Dene",
  onBack = () => window.history.back(),
}) {
  // Set default title based on error type if not provided
  if (!title) {
    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        title = "Sunucu Hatası";
        break;
      case "UNAUTHORIZED":
      case "FORBIDDEN":
        title = "Yetkilendirme Hatası";
        break;
      case "NOT_FOUND":
        title = "İçerik Bulunamadı";
        break;
      case "VALIDATION_ERROR":
        title = "Doğrulama Hatası";
        break;
      case "BAD_REQUEST":
        title = "Geçersiz İstek";
        break;
      case "SERVICE_UNAVAILABLE":
        title = "Servis Kullanılamıyor";
        break;
      case "NO_TOKEN":
        title = "Hesabınıza giriş yapmanız gerekiyor";
        break;
      default:
        title = "Hata";
    }
  }

  // Construct error message with code if present
  const fullMessage = code ? `${message} (Kod: ${code})` : message;

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <Alert
        color={color}
        title={title}
        description={fullMessage}
        className="mb-4 w-full"
      />

      <div className="flex gap-3 mt-4">
        {onAction && (
          <Button
            color={color === "danger" ? "primary" : color}
            onPress={onAction}
          >
            {actionText}
          </Button>
        )}

        <Button variant="ghost" onPress={onBack}>
          Geri Dön
        </Button>
      </div>
    </div>
  );
}
