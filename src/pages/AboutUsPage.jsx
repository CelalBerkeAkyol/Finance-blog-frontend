import React from "react";
import { Spacer } from "@nextui-org/react";

const AboutUsPage = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {/* Başlık */}
      <h1 style={{ textAlign: "center" }}>Ben Kimim</h1>

      {/* Hakkımızda İçeriği */}
      <p>
        Merhaba, ben <strong> Celal Berke Akyol </strong>. Bilgisayar
        mühendisliği alanında eğitim alıyorum ve finans sektöründe yenilikçi
        çözümler geliştiren bir yazılımcıyım. Bu projede, finans alanındaki blog
        yazılarımı, veri analizlerini ve uygulama geliştirme çalışmalarımı
        paylaşıyorum. Amacım, kullanıcılarıma kaliteli içerikler sunmak ve
        finans dünyasındaki gelişmeleri anlaşılır bir şekilde aktarmaktır.
      </p>

      <Spacer y={2} />

      {/* İletişim Bölümü */}
      <h3>📩 İletişim</h3>
      <p>
        Email: <a href="buscberke@gmail.com">buscberke@gmail.com</a>
      </p>
      <p>
        Telefon: <a href="tel:+905355545154">+5355545154</a>
      </p>

      <Spacer y={2} />

      {/* Web Siteleri Bölümü */}
      <h3>🌐 Sosyal Medya Hesaplarım</h3>
      <p>
        <a
          href="https://www.linkedin.com/in/celal-berke-akyol-389a3a216/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </p>
    </div>
  );
};

export default AboutUsPage;
