import React from "react";
import { Icon } from "@iconify/react";

const ShareButtons = ({ url }) => {
  const handleShare = (platform, shareUrl) => {
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex gap-1.5">
      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1DA1F2] text-white rounded-full hover:bg-[#0d8ddf] hover:text-white min-w-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation shadow-sm"
        aria-label="Paylaş: Twitter"
      >
        <Icon icon="mdi:twitter" width="18" className="text-white" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0077B5] text-white rounded-full hover:bg-[#005f8e] hover:text-white min-w-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation shadow-sm"
        aria-label="Paylaş: LinkedIn"
      >
        <Icon icon="mdi:linkedin" width="18" className="text-white" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877F2] text-white rounded-full hover:bg-[#1259c3] hover:text-white min-w-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation shadow-sm"
        aria-label="Paylaş: Facebook"
      >
        <Icon icon="mdi:facebook" width="18" className="text-white" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white rounded-full hover:bg-[#1aa74f] hover:text-white min-w-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation shadow-sm"
        aria-label="Paylaş: WhatsApp"
      >
        <Icon icon="mdi:whatsapp" width="18" className="text-white" />
      </a>

      {/* E-posta (Mail) */}
      <a
        href={`mailto:?subject=Bu içeriğe göz atmalısın!&body=${encodeURIComponent(
          url
        )}`}
        className="bg-[#D44638] text-white rounded-full hover:bg-[#b13327] hover:text-white min-w-0 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation shadow-sm"
        aria-label="Paylaş: E-posta"
      >
        <Icon icon="mdi:email-outline" width="18" className="text-white" />
      </a>
    </div>
  );
};

export default ShareButtons;
