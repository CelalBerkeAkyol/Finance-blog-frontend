import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar } from "@nextui-org/react";

export default function ChatMessages({ messages, isTyping, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-12 pt-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {/* Yazıyor Animasyonu */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

/**
 * Mesaj balonlarını render eder.
 * @param {Object} props.message - Mesaj objesi.
 */
function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Bot Avatar (Mesaj başlangıcında) */}
      {!isUser && (
        <Avatar
          alt="Bot Avatar"
          size="sm"
          classNames={{ icon: "text-black/80" }}
          className="self-start"
        />
      )}

      {/* Mesaj Gövdesi */}
      <div
        className={`p-3 rounded text-sm ${
          isUser
            ? "bg-lime-700 text-white self-end max-w-[50%]"
            : "bg-gray-50 text-black w-full p-8 max-w-[90%]"
        }`}
      >
        {message.sender === "bot" ? (
          <ReactMarkdown
            children={message.content}
            remarkPlugins={[remarkGfm]}
            className="prose max-w-none"
          />
        ) : (
          <span>{message.content}</span>
        )}
      </div>

      {/* Kullanıcı Avatar (Mesaj başlangıcında) */}
      {isUser && (
        <Avatar
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          alt="User Avatar"
          size="sm"
          color="success"
          className="self-start"
        />
      )}
    </div>
  );
}

/**
 * Yazıyor animasyonu bileşeni.
 */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        classNames={{ icon: "text-black/80" }}
        alt="Bot Typing Avatar"
        size="sm"
      />
      <div className="bg-gray-100 text-black p-3 rounded animate-pulse text-sm">
        GPT is typing...
      </div>
    </div>
  );
}
