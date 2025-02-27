import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const ShareButtons = ({ url }) => {
  return (
    <div className="flex gap-1">
      {/* Twitter */}
      <Button
        as="a"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        isIconOnly
        className="bg-[#1DA1F2] text-white rounded-full hover:bg-[#0d8ddf] hover:text-white min-w-0 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:twitter" width="16" className="text-white" />
      </Button>

      {/* LinkedIn */}
      <Button
        as="a"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        isIconOnly
        className="bg-[#0077B5] text-white rounded-full hover:bg-[#005f8e] hover:text-white min-w-0 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:linkedin" width="16" className="text-white" />
      </Button>

      {/* Facebook */}
      <Button
        as="a"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        isIconOnly
        className="bg-[#1877F2] text-white rounded-full hover:bg-[#1259c3] hover:text-white min-w-0 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:facebook" width="16" className="text-white" />
      </Button>

      {/* WhatsApp */}
      <Button
        as="a"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
        target="_blank"
        isIconOnly
        className="bg-[#25D366] text-white rounded-full hover:bg-[#1aa74f] hover:text-white min-w-0 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:whatsapp" width="16" className="text-white" />
      </Button>

      {/* E-posta (Mail) */}
      <Button
        as="a"
        href={`mailto:?subject=Bu içeriğe göz atmalısın!&body=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        isIconOnly
        className="bg-[#D44638] text-white rounded-full hover:bg-[#b13327] hover:text-white min-w-0 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:email-outline" width="16" className="text-white" />
      </Button>
    </div>
  );
};

export default ShareButtons;
