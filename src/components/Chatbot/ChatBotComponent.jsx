// src/components/Chatbot/ChatBotComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import PromptInputWithBottomActions from "./prompt-input-with-bottom-actions";
import ChatSideBar from "../dashboard/sidebars/ChatSideBar";
import FeaturesCards from "./features-cards";
import PrePreparedQuestions from "./PrePreparedQuestions";
import api from "../../api"; // <-- Özel axios instance

export default function ChatBotComponent() {
  // --- State Yönetimi ---
  const [messages, setMessages] = useState([]); // Seçili odanın mesajları
  const [userMessage, setUserMessage] = useState(""); // Kullanıcı mesajı
  const [hasSentMessage, setHasSentMessage] = useState(false); // Mesaj gönderildi mi?
  const [isTyping, setIsTyping] = useState(false); // Bot yazıyor mu?
  const [chatRooms, setChatRooms] = useState([]); // Tüm odalar
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Seçili oda ID'si

  const messagesEndRef = useRef(null); // Scroll yönetimi için ref

  // --- Yeni Sohbet Başlatma ---
  const startNewChat = () => {
    setMessages([]); // Mesajları temizle
    setUserMessage(""); // Kullanıcı mesajını sıfırla
    setHasSentMessage(false); // Yeni sohbet başlatıldı
    setSelectedRoomId(null); // Seçili oda yok
    setIsTyping(false); // Bot yazmıyor
  };

  // --- Uygulama Yüklenirken Sohbet Odalarını Yükle ---
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await api.get("/chatbot/chat-rooms/");
        setChatRooms(response.data);
      } catch (err) {
        console.error("Sohbet odaları alınırken hata:", err);
      }
    };
    fetchChatRooms();
  }, []);

  // --- Oda Seçimi ve Mesaj Yükleme ---
  const handleRoomSelect = async (roomId) => {
    setSelectedRoomId(roomId);
    setMessages([]); // Yeni oda seçildiğinde mesajları temizle
    setHasSentMessage(true);

    try {
      const resp = await api.get(`/chatbot/chat-rooms/${roomId}/`);
      setMessages(resp.data.messages || []);
    } catch (error) {
      console.error("Odanın mesajlarını alırken hata:", error);
    }
  };

  // --- Tüm Odaları ve Mesajları Sil ---
  const clearAllRooms = async () => {
    try {
      await api.delete("/chatbot/chat-rooms/"); // Tüm odaları sil
      setChatRooms([]);
      setMessages([]);
      setSelectedRoomId(null);
      setHasSentMessage(false);
      alert("Başarılı bir şekilde işlem tamamlandı.");
    } catch (error) {
      console.error("Tüm odaları silerken hata oluştu:", error);
    }
  };

  // --- Mesaj Gönderme ve Bot Cevabı Alma ---
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = { sender: "user", content: message };
    setMessages((prev) => [...prev, newMessage]);
    setUserMessage("");
    setHasSentMessage(true);
    setIsTyping(true);

    try {
      const response = await api.post("/chatbot/ask/", {
        message,
        chat_room_id: selectedRoomId,
      });
      const botMessage = {
        sender: "bot",
        content:
          response.data?.response?.content || "Sunucudan yanıt alınamadı.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Bir hata oluştu. Lütfen tekrar deneyin." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Her yeni mesajda scroll'u aşağı kaydır ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen w-full">
      {/* SOLDA SİDEBAR */}
      <div className="w-64">
        <ChatSideBar
          chatRooms={chatRooms}
          onRoomSelect={handleRoomSelect}
          onClearAllRooms={clearAllRooms}
          onNewChat={startNewChat} // Yeni sohbet başlatma
        />
      </div>

      {/* SAĞDA Sohbet Alanı */}
      <div className="flex-1 flex flex-col px-2 pt-8">
        {!hasSentMessage ? (
          <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center gap-12 p-4">
            <h1 className="text-2xl font-medium text-default-700 text-center">
              How can I help you today?
            </h1>
            <FeaturesCards />
            <PrePreparedQuestions setUserMessage={setUserMessage} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
          </div>
        )}

        {/* Alt Input Alanı */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <PromptInputWithBottomActions
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            onSubmit={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
