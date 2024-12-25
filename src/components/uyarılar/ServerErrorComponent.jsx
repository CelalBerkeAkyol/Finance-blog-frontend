// src/components/ErrorComponent.jsx
import React from "react";

import { Alert } from "@nextui-org/react";

export default function ServerErrorComponent({ message }) {
  const title = "Server'da kritik bir hata oluştu";

  return (
    <div className="flex items-center justify-center w-full ">
      <Alert color="danger" description={message} title={title} />
    </div>
  );
}
