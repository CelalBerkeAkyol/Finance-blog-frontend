import React from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function PromptInputWithBottomActions({
  userMessage,
  setUserMessage,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage.trim()) {
      onSubmit(userMessage); // Mesaj gönderme fonksiyonu
      setUserMessage(""); // Giriş alanını temizle
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userMessage.trim()) {
        onSubmit(userMessage); // Mesaj gönderme
        setUserMessage(""); // Giriş alanını temizle
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-start rounded-medium bg-default-100 p-4"
    >
      <textarea
        className="w-full rounded-lg p-4 bg-[#F4F4F5] resize-none"
        value={userMessage} // Giriş alanını kontrol eder
        onChange={(e) => setUserMessage(e.target.value)} // Kullanıcı girişini işler
        onKeyDown={handleKeyPress} // Enter ile mesaj gönderme
        placeholder="Enter your message here..."
      ></textarea>

      <div className="flex justify-between items-center w-full mt-2">
        {/* Sol Alt Köşe: Attach Button */}
        <Tooltip showArrow content="Attach a file">
          <Button
            size="sm"
            startContent={
              <Icon
                className="text-default-500"
                icon="solar:paperclip-linear"
                width={18}
              />
            }
            variant="flat"
          >
            Attach
          </Button>
        </Tooltip>
        {/* Bilgilendirme yazısı - orta */}
        <p className="text-sm text-default-400 text-center mt-2">
          Fin Ai yatırım tavsiyesi vermez. Yatırım kararı almadan önce
          bilgilerimizi kontrol edin ve bir uzmana danışın.
        </p>
        {/* Sağ Alt Köşe: Send Button */}
        <Tooltip showArrow content="Send message">
          <Button
            isIconOnly
            type="submit"
            color="default"
            isDisabled={!userMessage.trim()} // Boş mesaj gönderimini engeller
            radius="lg"
            size="sm"
            variant="solid"
          >
            <Icon icon="solar:arrow-up-linear" width={20} />
          </Button>
        </Tooltip>
      </div>
    </form>
  );
}
