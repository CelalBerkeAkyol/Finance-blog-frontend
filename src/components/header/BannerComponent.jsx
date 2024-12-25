import React from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function BannerComponent() {
  return (
    <div className="flex w-full items-center justify-center gap-x-3 border-b-1 border-divider bg-background/[0.15] px-6 py-2 backdrop-blur-xl sm:px-3.5 ">
      <p className="text-small text-foreground">
        <Link className="text-inherit" to="/chatbot">
          Yeni Chat Botumuzla konuşması şimdi ücretsiz hemen dene.&nbsp;
        </Link>
      </p>
      <Button
        as={Link}
        to="/chatbot"
        className="group relative h-9 overflow-hidden bg-transparent text-small font-normal"
        color="default"
        endContent={
          <Icon
            className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
            icon="solar:arrow-right-linear"
            width={16}
          />
        }
        style={{
          border: "solid 2px transparent",
          backgroundImage: `linear-gradient(hsl(var(--nextui-background)), hsl(var(--nextui-background))), linear-gradient(to right, #F871A0, #9353D3)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        variant="bordered"
      >
        Free Chat
      </Button>
    </div>
  );
}
