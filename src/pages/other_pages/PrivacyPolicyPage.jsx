import React from "react";
import { Spacer } from "@nextui-org/react";

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-center text-4xl font-bold mb-4">
        Gizlilik Politikası
      </h1>

      <p>
        [Blog Adınız] (“Biz”, “Bize” veya “Bizim”), kullanıcılarımızın
        gizliliğine büyük önem verir. Bu gizlilik politikası, web sitemizi
        ziyaret eden veya hizmetlerimizi kullanan kişisel verilerin nasıl
        toplandığını, işlendiğini ve korunduğunu açıklamaktadır.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">1. Toplanan Veriler</h2>
      <p>
        Hizmetlerimizi kullanırken;
        <strong>kişisel bilgiler</strong> (ad, soyad, e-posta adresi, telefon
        numarası gibi) ve
        <strong>otomatik olarak toplanan veriler</strong> (IP adresi, tarayıcı
        bilgileri, çerezler, kullanım verileri) toplanmaktadır.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        2. Verilerin Kullanım Amaçları
      </h2>
      <p>
        Toplanan veriler; hizmetlerimizi geliştirmek, kullanıcı deneyimini
        iyileştirmek, güvenlik önlemleri almak, pazarlama ve iletişim
        faaliyetleri yürütmek amacıyla kullanılmaktadır. Ayrıca, analitik ve
        raporlama çalışmaları için üçüncü taraf analiz araçları (ör. Google
        Analytics) ile entegre edilebilmektedir.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        3. Çerezler ve İzleme Teknolojileri
      </h2>
      <p>
        Web sitemiz, kullanıcı deneyimini artırmak ve analiz amacıyla çerezler
        kullanmaktadır. Çerezler sayesinde tarayıcı türü, sayfa görüntüleme
        sayısı, ziyaret süresi gibi veriler toplanmaktadır. Tarayıcı
        ayarlarınızdan çerezleri devre dışı bırakma seçeneğiniz bulunmaktadır;
        ancak bu durumda bazı hizmetlerimizde kısıtlamalar yaşanabilir.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        4. Üçüncü Taraf Hizmet Sağlayıcılar
      </h2>
      <p>
        Sitemizde yer alan bazı içerikler ve işlevler, üçüncü taraf hizmet
        sağlayıcılar (ör. reklam, analiz, sosyal medya eklentileri) tarafından
        sunulmaktadır. Bu hizmet sağlayıcıların gizlilik politikaları, kendi
        sitelerinde yer almaktadır. Biz, üçüncü tarafların veri işleme
        yöntemlerinden sorumlu tutulamayız.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        5. Veri Saklama ve Güvenlik
      </h2>
      <p>
        Toplanan veriler, yasal zorunluluklar ve hizmetlerimizin sürekliliği
        amacıyla belirli bir süre saklanmaktadır. Verilerinizin güvenliği için
        endüstri standartlarında şifreleme, erişim kontrolü ve güvenlik duvarı
        gibi teknik önlemler uygulanmaktadır.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">6. Kullanıcı Hakları</h2>
      <p>
        Kullanıcılar, kendileri hakkında toplanan verilere erişim, düzeltme,
        silme veya işleme itiraz etme haklarına sahiptir. Bu haklarınızı
        kullanmak için bize{" "}
        <a href="mailto:ornek@example.com" className="text-blue-500">
          ornek@example.com
        </a>
        adresinden ulaşabilirsiniz. Ayrıca, GDPR ve KVKK kapsamındaki haklarınız
        çerçevesinde ek bilgilendirme talep edebilirsiniz.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        7. Politikada Yapılacak Değişiklikler
      </h2>
      <p>
        Bu gizlilik politikası, yasal düzenlemeler veya hizmetlerimizde
        yapılacak değişiklikler doğrultusunda güncellenebilir. Herhangi bir
        değişiklik yapıldığında, güncellenmiş politika web sitemizde
        yayınlanacaktır.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">8. İletişim</h2>
      <p>
        Gizlilik politikamızla ilgili sorularınız veya talepleriniz için lütfen
        <a href="mailto:ornek@example.com" className="text-blue-500">
          {" "}
          ornek@example.com
        </a>{" "}
        adresi üzerinden bizimle iletişime geçiniz.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
