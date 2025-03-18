import React, { createContext, useContext, useState, useCallback } from "react";
import AlertComponent from "../components/feedback/AlertComponent";
import ToastComponent from "../components/feedback/ToastComponent";

// Context oluştur
const FeedbackContext = createContext();

/**
 * Tüm uygulama çapında uyarı ve bildirimleri yönetmek için kullanılan provider
 * @param {Object} props
 * @param {React.ReactNode} props.children - Alt bileşenler
 */
export function FeedbackProvider({ children }) {
  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
    code: "",
    onAction: null,
    actionText: "Tamam",
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    duration: 3000,
  });

  // Alert göster
  const showAlert = useCallback(
    ({
      message,
      title,
      type = "info",
      code = "",
      onAction = null,
      actionText = "Tamam",
    }) => {
      setAlert({
        show: true,
        message,
        title,
        type,
        code,
        onAction,
        actionText,
      });
    },
    []
  );

  // Alert kapat
  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, show: false }));
  }, []);

  // Toast göster
  const showToast = useCallback(
    ({ message, type = "success", duration = 3000 }) => {
      // Eğer zaten bir toast gösteriliyorsa, önce onu kapat
      if (toast.show) {
        setToast((prev) => ({ ...prev, show: false }));
        setTimeout(() => {
          setToast({ show: true, message, type, duration });
        }, 300);
      } else {
        setToast({ show: true, message, type, duration });
      }
    },
    [toast.show]
  );

  // Toast kapat
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  // Kısayol fonksiyonları
  const success = useCallback(
    (message, options = {}) =>
      showToast({ message, type: "success", ...options }),
    [showToast]
  );

  const error = useCallback(
    (message, options = {}) =>
      showToast({ message, type: "error", ...options }),
    [showToast]
  );

  const warning = useCallback(
    (message, options = {}) =>
      showToast({ message, type: "warning", ...options }),
    [showToast]
  );

  const info = useCallback(
    (message, options = {}) => showToast({ message, type: "info", ...options }),
    [showToast]
  );

  // Context değeri
  const value = {
    showAlert,
    hideAlert,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {/* Alert */}
      {alert.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <AlertComponent
              message={alert.message}
              title={alert.title}
              type={alert.type}
              code={alert.code}
              onAction={alert.onAction}
              actionText={alert.actionText}
              onClose={hideAlert}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <ToastComponent
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </FeedbackContext.Provider>
  );
}

/**
 * Feedback context'i kullanmak için hook
 * @returns {Object} feedback fonksiyonları
 */
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}
