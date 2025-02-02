import React from "react";
import { Spacer } from "@nextui-org/react";

const DisclaimerPage = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {/* Başlık */}
      <h1 style={{ textAlign: "center" }}>Hukuki Uyarı</h1>

      {/* Açıklama Metni */}
      <p>
        Bu web sitesi, finans alanında yazdığım blog yazılarını içermektedir.
        Yazılan içerikler kişisel görüşlerimi ve araştırmalarımı yansıtmaktadır.
        İçeriklerdeki hatalardan, eksikliklerden veya yanlış bilgilerden ben
        sorumlu tutulamam.
      </p>

      <Spacer y={1} />

      <p>
        Lütfen, finansal yatırım veya kritik kararlar almadan önce profesyonel
        danışmanlık hizmeti alınız.
      </p>
    </div>
  );
};

export default DisclaimerPage;
