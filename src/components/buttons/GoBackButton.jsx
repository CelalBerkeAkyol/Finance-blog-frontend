import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

// Geri Git İkonu
export const BackIcon = ({
  fill = "#FFFFFF",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 14}
      viewBox="0 0 24 24"
      width={size || width || 14}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 19l-7-7m0 0l7-7m-7 7h16"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Mesaj İkonu (Yeni Sohbet)
export const MessageIcon = ({
  fill = "#FFFFFF",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 14}
      viewBox="0 0 24 24"
      width={size || width || 14}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function GoBackButton({ onNewChat }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row gap-4 pt-2">
      {/* Geri Git Butonu */}
      <Button
        isIconOnly
        aria-label="Go Back"
        color="default"
        size="sm"
        variant="ghost"
        onPress={() => navigate("/app")}
      >
        <BackIcon />
      </Button>

      {/* Yeni Sohbet Butonu */}
      <Button
        isIconOnly
        aria-label="New Chat"
        color="default"
        size="sm"
        variant="ghost"
        onPress={onNewChat} // Parent'tan gelen callback'i tetikleme
      >
        <MessageIcon />
      </Button>
    </div>
  );
}
