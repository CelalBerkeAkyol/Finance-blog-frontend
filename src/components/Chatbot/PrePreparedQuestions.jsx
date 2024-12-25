import React from "react";
import { Button, ScrollShadow } from "@nextui-org/react";

export default function PrePreparedQuestions({ setUserMessage }) {
  const ideas = [
    {
      title: "THYAO şirketinin yaptığı işi özetler misin",
      description: "explain it in simple terms",
    },
    {
      title: "Give me 10 ideas for my next blog post",
      description: "include only the best ideas",
    },
    {
      title: "Compare NextUI with other UI libraries",
      description: "be as objective as possible",
    },
  ];

  const handleClick = (idea) => {
    setUserMessage(idea.title); // Giriş alanını günceller
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <ScrollShadow
        hideScrollBar
        className="flex flex-nowrap gap-2"
        orientation="horizontal"
      >
        <div className="flex gap-2">
          {ideas.map(({ title, description }, index) => (
            <Button
              key={index}
              className="flex h-14 flex-col items-start gap-0"
              variant="flat"
              onClick={() => handleClick({ title, description })} // Tıklama olayını işler
            >
              <p>{title}</p>
              <p className="text-default-500">{description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
