// src/components/LogoutButton.jsx
import React from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { logoutUser, clearState } from "../../app/features/user/userSlice";
import { useFeedback } from "../../context/FeedbackContext";

// Navbar ile aynı metin boyutu için stil
const navTextStyle = { fontSize: "15px" };

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

  // Sidebar için farklı bir tasarım, normal durum için farklı
  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 ${
        sidebar
          ? "w-full text-left py-2 hover:text-primary"
          : "hover:text-primary px-2 py-1"
      }`}
      style={navTextStyle}
    >
      {!sidebar && <Icon icon="solar:logout-3-bold-duotone" width="16" />}
      Logout
    </button>
  );
}
