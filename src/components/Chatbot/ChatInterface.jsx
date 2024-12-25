import React, { useState, useEffect } from "react";
import { fetchMessages, sendMessage } from "../../api/chatApi";
import ChatMessages from "./ChatMessages";

export default function ChatInterface({ chatRoomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(chatRoomId);
      setMessages(fetchedMessages);
    };
    loadMessages();
  }, [chatRoomId]);

  // Mesaj gönder
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = await sendMessage(chatRoomId, "user", input);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="chat-interface">
      <ChatMessages messages={messages} isTyping={isTyping} />
      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button onClick={handleSendMessage}>Gönder</button>
      </div>
    </div>
  );
}
