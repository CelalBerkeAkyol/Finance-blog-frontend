import React from "react";
import { Spacer } from "@nextui-org/react";

const PrivacyPolicyPage = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {/* Başlık */}
      <h1 style={{ textAlign: "center" }}>Gizlilik Politikası</h1>

      {/* Giriş Bölümü */}
      <p>
        Bu gizlilik politikası, [Şirket Adınız] tarafından sağlanan hizmetleri
        kullanırken kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve
        korunduğunu açıklar.
      </p>

      <Spacer y={1} />

      {/* Toplanan Bilgiler */}
      <h2>1. Hangi Bilgileri Topluyoruz?</h2>
      <p>Hizmetlerimizi kullanırken aşağıdaki türde bilgiler toplanabilir:</p>
      <ul>
        <li>Ad, soyad ve e-posta adresi gibi kişisel bilgiler</li>
        <li>Çerezler ve kullanım verileri</li>
        <li>Analitik ve trafik bilgileri</li>
      </ul>

      <Spacer y={1} />

      {/* Kullanım Amaçları */}
      <h2>2. Bilgilerin Kullanımı</h2>
      <p>Toplanan bilgiler şu amaçlarla kullanılabilir:</p>
      <ul>
        <li>Hizmetleri geliştirmek ve optimize etmek</li>
        <li>Kullanıcı deneyimini iyileştirmek</li>
        <li>Güvenliği sağlamak ve dolandırıcılığı önlemek</li>
      </ul>

      <Spacer y={1} />

      {/* Çerezler */}
      <h2>3. Çerezler (Cookies)</h2>
      <p>
        Web sitemiz, kullanıcı deneyimini geliştirmek için çerezleri
        kullanmaktadır. Çerezleri tarayıcınızdan devre dışı bırakabilirsiniz.
      </p>

      <Spacer y={1} />

      {/* Üçüncü Taraf Hizmetleri */}
      <h2>4. Üçüncü Taraf Hizmetleri</h2>
      <p>
        Web sitemizde Google Analytics ve diğer üçüncü taraf hizmetleri
        kullanabiliriz. Bu hizmetler hakkında daha fazla bilgi almak için ilgili
        sağlayıcıların gizlilik politikalarını inceleyin.
      </p>

      <Spacer y={1} />

      {/* Gizlilik Politikası Güncellemeleri */}
      <h2>5. Değişiklikler</h2>
      <p>
        Gizlilik politikamız zaman zaman güncellenebilir. Değişiklikler bu sayfa
        üzerinden duyurulacaktır.
      </p>

      <Spacer y={2} />

      {/* İletişim */}
      <h2>📩 İletişim</h2>
      <p>
        Herhangi bir sorunuz varsa bizimle{" "}
        <a href="mailto:ornek@example.com">ornek@example.com</a> adresinden
        iletişime geçebilirsiniz.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
