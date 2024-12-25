// src/components/dashboard/sidebars/ChatSideBar.jsx
import React from "react";
import SideBarsFooter from "./SideBarsFooter";
import GoBackButton from "../../buttons/GoBackButton";

export default function ChatSideBar({
  chatRooms,
  onRoomSelect,
  onClearAllRooms,
  onNewChat,
}) {
  // Hata veya loading durumunu yönetmek istiyorsan parent’ta da tutabilirsin,
  // ama basit olsun diye bu bileşende yok.

  return (
    <div className="bg-lime-800 text-neutral-100 h-full flex flex-col justify-between overflow-y-auto text-sm">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">Fin AI</h1>
        <GoBackButton onNewChat={onNewChat} />
      </div>

      {/* Oda Listesi */}
      <div className="flex-grow overflow-y-auto px-4">
        <ul className="space-y-3">
          {(chatRooms || []).map((room) => (
            <li
              key={room.id}
              className="bg-lime-700 p-3 rounded-lg shadow-md flex flex-col cursor-pointer"
              onClick={() => onRoomSelect(room.id)}
            >
              <span className="font-semibold">{room.name}</span>
              <span className="text-xs text-gray-300">
                Oda ID: {room.id} — {room.messages?.length ?? 0} mesaj
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tüm Odaları Sil Butonu */}
      <div className="border-t border-lime-900 p-4">
        <button
          onClick={onClearAllRooms}
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Tüm Sohbetleri Sil
        </button>
      </div>
      <SideBarsFooter />
    </div>
  );
}
