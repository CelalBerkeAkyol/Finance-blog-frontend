import React from "react";
import CustomNavbar from "../../components/header/CustomNavbar";

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <div className="bg-white py-2 mb-12 min-h-full">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 px-4 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Gizlilik Politikası
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300">
                Verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında
                bilgi
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600">
                <p className="mb-6">
                  Learn Deep Invest ("Biz", "Bize" veya "Bizim"),
                  kullanıcılarımızın gizliliğine büyük önem verir. Bu gizlilik
                  politikası, web sitemizi ziyaret eden veya hizmetlerimizi
                  kullanan kişilerin verilerinin nasıl toplandığını, işlendiğini
                  ve korunduğunu açıklamaktadır.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  1. Toplanan Veriler
                </h2>
                <p className="mb-6">
                  Hizmetlerimizi kullanırken;
                  <strong> kişisel bilgiler</strong> (ad, soyad, e-posta adresi,
                  telefon numarası gibi) ve
                  <strong> otomatik olarak toplanan veriler</strong> (IP adresi,
                  tarayıcı bilgileri, çerezler, kullanım verileri)
                  toplanmaktadır.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  2. Verilerin Kullanım Amaçları
                </h2>
                <p className="mb-6">
                  Toplanan veriler; hizmetlerimizi geliştirmek, kullanıcı
                  deneyimini iyileştirmek, güvenlik önlemleri almak, pazarlama
                  ve iletişim faaliyetleri yürütmek amacıyla kullanılmaktadır.
                  Ayrıca, analitik ve raporlama çalışmaları için üçüncü taraf
                  analiz araçları (ör. Google Analytics) ile entegre
                  edilebilmektedir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  3. Çerezler ve İzleme Teknolojileri
                </h2>
                <p className="mb-6">
                  Web sitemiz, kullanıcı deneyimini artırmak ve analiz amacıyla
                  çerezler kullanmaktadır. Çerezler sayesinde tarayıcı türü,
                  sayfa görüntüleme sayısı, ziyaret süresi gibi veriler
                  toplanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı
                  bırakma seçeneğiniz bulunmaktadır; ancak bu durumda bazı
                  hizmetlerimizde kısıtlamalar yaşanabilir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  4. Üçüncü Taraf Hizmet Sağlayıcılar
                </h2>
                <p className="mb-6">
                  Sitemizde yer alan bazı içerikler ve işlevler, üçüncü taraf
                  hizmet sağlayıcılar (ör. reklam, analiz, sosyal medya
                  eklentileri) tarafından sunulmaktadır. Bu hizmet
                  sağlayıcıların gizlilik politikaları, kendi sitelerinde yer
                  almaktadır. Biz, üçüncü tarafların veri işleme yöntemlerinden
                  sorumlu tutulamayız.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  5. Veri Saklama ve Güvenlik
                </h2>
                <p className="mb-6">
                  Toplanan veriler, yasal zorunluluklar ve hizmetlerimizin
                  sürekliliği amacıyla belirli bir süre saklanmaktadır.
                  Verilerinizin güvenliği için endüstri standartlarında
                  şifreleme, erişim kontrolü ve güvenlik duvarı gibi teknik
                  önlemler uygulanmaktadır.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  6. Kullanıcı Hakları
                </h2>
                <p className="mb-6">
                  Kullanıcılar, kendileri hakkında toplanan verilere erişim,
                  düzeltme, silme veya işleme itiraz etme haklarına sahiptir. Bu
                  haklarınızı kullanmak için bize{" "}
                  <a
                    href="mailto:info@learndeepinvest.com"
                    className="text-primary hover:underline"
                  >
                    info@learndeepinvest.com
                  </a>{" "}
                  adresinden ulaşabilirsiniz. Ayrıca, GDPR ve KVKK kapsamındaki
                  haklarınız çerçevesinde ek bilgilendirme talep edebilirsiniz.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  7. Politikada Yapılacak Değişiklikler
                </h2>
                <p className="mb-6">
                  Bu gizlilik politikası, yasal düzenlemeler veya
                  hizmetlerimizde yapılacak değişiklikler doğrultusunda
                  güncellenebilir. Herhangi bir değişiklik yapıldığında,
                  güncellenmiş politika web sitemizde yayınlanacaktır.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">8. İletişim</h2>
                <p className="mb-6">
                  Gizlilik politikamızla ilgili sorularınız veya talepleriniz
                  için lütfen{" "}
                  <a
                    href="mailto:info@learndeepinvest.com"
                    className="text-primary hover:underline"
                  >
                    info@learndeepinvest.com
                  </a>{" "}
                  adresi üzerinden bizimle iletişime geçiniz.
                </p>

                <p className="text-sm text-gray-400 mt-8 pt-4 border-t border-gray-100">
                  Son güncelleme: 1 Haziran 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
