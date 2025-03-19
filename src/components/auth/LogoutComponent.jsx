// src/components/LogoutButton.jsx
import React from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { logoutUser, clearState } from "../../app/features/user/userSlice";
import { useFeedback } from "../../context/FeedbackContext";
import { Button } from "@nextui-org/react";

// Sidebar için font boyutu
const sidebarTextStyle = { fontSize: "0.8rem" }; // xs boyutu

export default function LogoutComponent({ sidebar = false }) {
  const dispatch = useDispatch();
  const { success, error: showError } = useFeedback();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearState()); // Ekstra temizlik (opsiyonel)
      success("Başarıyla çıkış yapıldı");
    } catch (error) {
      showError(error?.message || "Çıkış yapılırken bir hata oluştu");
    }
  };

  // Sidebar modu için farklı render yapısı
  if (sidebar) {
    return (
      <button
        onClick={handleLogout}
        className="w-full text-left py-2 hover:text-primary text-xs flex items-center gap-2"
        style={sidebarTextStyle}
      >
        <Icon
          icon="heroicons:arrow-right-on-rectangle"
          width="16"
          className="text-gray-600"
        />
        Logout
      </button>
    );
  }

  // Normal navbar için NextUI Button kullan
  return (
    <Button
      variant="ghost"
      size="sm"
      startContent={
        <Icon icon="heroicons:arrow-right-on-rectangle" width="16" />
      }
      onClick={handleLogout}
      className="min-w-0 px-2"
    >
      <span className="hidden xl:block">Çıkış</span>
    </Button>
  );
}
