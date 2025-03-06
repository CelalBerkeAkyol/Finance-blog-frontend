import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function BannerComponent() {
  return (
    <div className="flex w-full items-center justify-center gap-x-3 border-b-1 bg-gray-800 border-stone-200 border-divider bg-background/[0.15] px-6 py-2 backdrop-blur-xl sm:px-3.5 z-[9999]">
      <p className="text-small text-foreground text-white">
        <Link className="text-inherit" to="/about-us">
          Çalışmalarımızı beğeniyorsanız bize destek olabilirsiniz.&nbsp;
        </Link>
      </p>
      <Button
        as={Link}
        to="/about-us"
        className="group relative h-9 overflow-hidden bg-transparent text-small text-white font-normal"
        color="default"
        endContent={
          <Icon
            className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
            icon="solar:arrow-right-linear"
            width={16}
          />
        }
        variant="bordered"
      >
        Destek Ol
      </Button>
    </div>
  );
}
