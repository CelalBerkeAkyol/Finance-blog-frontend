import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const ShareButtons = ({ url }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // ESC tuşu ve dışarı tıklama ile menüyü kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showShareOptions &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };

    const handleEscKey = (event) => {
      if (showShareOptions && event.keyCode === 27) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showShareOptions]);

  // Animasyon efekti için
  useEffect(() => {
    if (showShareOptions) {
      setAnimationClass("share-dropdown-in");
    } else {
      setAnimationClass("");
    }
  }, [showShareOptions]);

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleShare = (platform, shareUrl) => {
    window.open(shareUrl, "_blank");
  };

  // Dropdown olan paylaşım butonları
  const shareOptions = (
    <div className="grid grid-cols-5 gap-2">
      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-80 hover:scale-110 min-w-0 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation shadow-md transition-all duration-200"
        aria-label="Paylaş: Twitter"
      >
        <Icon icon="mdi:twitter" width="20" className="text-white" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0077B5] text-white rounded-full hover:bg-opacity-80 hover:scale-110 min-w-0 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation shadow-md transition-all duration-200"
        aria-label="Paylaş: LinkedIn"
      >
        <Icon icon="mdi:linkedin" width="20" className="text-white" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877F2] text-white rounded-full hover:bg-opacity-80 hover:scale-110 min-w-0 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation shadow-md transition-all duration-200"
        aria-label="Paylaş: Facebook"
      >
        <Icon icon="mdi:facebook" width="20" className="text-white" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white rounded-full hover:bg-opacity-80 hover:scale-110 min-w-0 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation shadow-md transition-all duration-200"
        aria-label="Paylaş: WhatsApp"
      >
        <Icon icon="mdi:whatsapp" width="20" className="text-white" />
      </a>

      {/* E-posta (Mail) */}
      <a
        href={`mailto:?subject=Bu içeriğe göz atmalısın!&body=${encodeURIComponent(
          url
        )}`}
        className="bg-[#D44638] text-white rounded-full hover:bg-opacity-80 hover:scale-110 min-w-0 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation shadow-md transition-all duration-200"
        aria-label="Paylaş: E-posta"
      >
        <Icon icon="mdi:email-outline" width="20" className="text-white" />
      </a>
    </div>
  );

  // Inline animasyon stili
  const animationStyle = `
    @keyframes share-dropdown-in {
      0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .share-dropdown-in {
      animation: share-dropdown-in 0.2s ease-out forwards;
    }
  `;

  return (
    <div className="relative inline-block">
      <style>{animationStyle}</style>

      {/* Paylaş butonu */}
      <button
        ref={buttonRef}
        onClick={toggleShareOptions}
        className="flex items-center gap-1.5 bg-primary text-white hover:bg-opacity-90 active:scale-95 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm"
        aria-label="Paylaş"
      >
        <Icon icon="mdi:share" width="18" />
        <span>Paylaş</span>
      </button>

      {/* Paylaşım seçenekleri dropdown */}
      {showShareOptions && (
        <div
          ref={menuRef}
          className={`absolute z-10 mt-2 -right-2 bg-white rounded-xl shadow-xl p-4 border border-gray-100 w-[260px] ${animationClass}`}
          style={{ transformOrigin: "top right" }}
        >
          <div className="mb-2 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">
              Bu içeriği paylaş
            </h3>
          </div>
          {shareOptions}
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
