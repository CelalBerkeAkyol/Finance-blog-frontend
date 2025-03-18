import React from "react";
import ErrorComponent from "./ErrorComponent";

/**
 * Component for displaying "Not Found" errors
 * @param {Object} props
 * @param {string} props.message - Custom message for the not found error
 * @param {string} props.resourceType - Type of resource that wasn't found (e.g., "Post", "Sayfa", "Kullanıcı")
 * @returns {React.ReactNode}
 */
export default function NotFoundErrorComponent({
  message,
  resourceType = "Sayfa",
}) {
  const defaultMessage = `Aradığınız ${resourceType.toLowerCase()} bulunamadı.`;

  return (
    <ErrorComponent
      message={message || defaultMessage}
      type="notFound"
      color="warning"
      actionText="Ana Sayfaya Dön"
      onAction={() => (window.location.href = "/")}
    />
  );
}
