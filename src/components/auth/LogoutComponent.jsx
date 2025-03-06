// src/components/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, clearState } from "../../app/features/user/userSlice";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
const LogoutComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearState()); // Ekstra temizlik (opsiyonel)
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      variant="bordered"
      size="sm"
      startContent={<Icon icon="ic:round-logout" width="20" />}
      onClick={handleLogout}
    />
  );
};

export default LogoutComponent;
