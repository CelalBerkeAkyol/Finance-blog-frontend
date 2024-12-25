import React from "react";
import { useNavigate } from "react-router-dom";

const ChatButton = ({ onClick }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate("/app/chatbot"); // "/chatbot" rotasına yönlendirir
  };

  return (
    <button
      onClick={handleChat}
      className="flex items-center justify-center flex-auto w-full text-sm gap-2 px-5 py-3 rounded-2xl shadow-md bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h8M8 14h5m-1 7a9 9 0 100-18 9 9 0 000 18z"
        />
      </svg>
      Chat Bot
    </button>
  );
};

export default ChatButton;
