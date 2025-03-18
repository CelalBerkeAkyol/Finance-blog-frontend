import React from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function BannerComponent() {
  return (
    <div className="w-full bg-gray-800 border-b border-stone-200 py-1.5 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-x-2 sm:gap-x-3">
        <p className="text-xs sm:text-sm text-white line-clamp-1 flex-grow-0">
          <Link className="text-inherit whitespace-nowrap" to="/about-us">
            Çalışmalarımızı beğeniyorsanız bize destek olabilirsiniz.
          </Link>
        </p>
        <Button
          as={Link}
          to="/about-us"
          className="group h-7 min-w-0 flex-shrink-0 overflow-hidden bg-transparent text-xs text-white font-normal px-2 sm:px-3"
          color="default"
          endContent={
            <Icon
              className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
              icon="solar:arrow-right-linear"
              width={14}
            />
          }
          variant="bordered"
          size="sm"
        >
          <span className="whitespace-nowrap">Destek Ol</span>
        </Button>
      </div>
    </div>
  );
}
