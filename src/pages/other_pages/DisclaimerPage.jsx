import React from "react";
import CustomNavbar from "../../components/header/CustomNavbar";

const DisclaimerPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <div className="bg-white py-2 mb-12 min-h-full">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-sky-950 to-lime-950 text-white py-4 px-4 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Kullanım Politikası
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300">
                Sitemizi kullanırken geçerli olan koşullar ve sorumluluklar
              </p>
            </div>

            <div className="pt-3">
              <div className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600">
                <h2 className="text-xl font-bold mt-8 mb-3">
                  1. Koşulların Kabulü
                </h2>
                <p className="mb-6">
                  Sitemizi ziyaret eden veya kullanan herkes bu kullanım
                  koşullarını kabul etmiş sayılır. Bu koşulları kabul
                  etmiyorsanız lütfen siteyi kullanmayınız. Site içinde sunulan
                  hizmet ve içeriklerden yararlanmaya devam etmeniz,
                  güncellenebilecek koşulların en son halini de kabul ettiğiniz
                  anlamına gelir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  2. Yasalara Uygunluk
                </h2>
                <p className="mb-6">
                  Siteyi kullanırken Türkiye Cumhuriyeti yasalarına ve ilgili
                  düzenlemelere uygun davranmayı kabul edersiniz. Hiçbir şekilde
                  yasa dışı, zararlı, başkalarının haklarını ihlal eden veya
                  içeriğin işleyişini aksatacak faaliyetlerde bulunamazsınız.
                  Aksi takdirde, doğan her türlü hukuki ve cezai sorumluluk
                  tarafınıza aittir ve site sahibi gerekli yasal adımları atma
                  hakkını saklı tutar.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  3. İçerik ve Fikri Mülkiyet
                </h2>
                <p className="mb-6">
                  Bu blog sitesinde yayınlanan yazı, görsel, video ve diğer tüm
                  içerikler aksi belirtilmedikçe site sahibine veya içeriğin
                  yazarına aittir ve telif hakları ile korunmaktadır.
                  Kullanıcılar, sitedeki içerikleri kişisel bilgilendirme amaçlı
                  olarak görüntüleyebilir; ancak bu içerikleri önceden yazılı
                  izin almaksızın kopyalayamaz, çoğaltamaz, dağıtamaz, başka
                  yerlerde yayımlayamaz veya ticari amaçla kullanamaz.
                  İçeriklerin izinsiz kullanımı durumunda hukuki yaptırımlar söz
                  konusu olabilir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  4. Kullanıcı Katkıları
                </h2>
                <p className="mb-6">
                  Bu sitede genel kullanıcılar yorum yapamaz veya herhangi bir
                  içerik gönderemez. Sitede yayınlanan tüm içerikler, site
                  sahibi veya onun tarafından yazar olarak yetkilendirilen
                  kişilerce oluşturulmaktadır. Bu nedenle, sitede yer alan
                  içerikler için yalnızca ilgili yazarlar sorumludur;
                  kullanıcıların paylaştığı herhangi bir içerik bulunmamaktadır.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  5. Ücret ve Üyelik
                </h2>
                <p className="mb-6">
                  Sitemizin kullanımı ücretsizdir ve içeriklere erişim için
                  herhangi bir üyelik veya abonelik gerekmemektedir. Sitede
                  satışa sunulan bir ürün veya hizmet bulunmamaktadır.
                  Kullanıcılar, herhangi bir ödeme yapmadan sitedeki tüm içeriğe
                  erişebilir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  6. Gizlilik ve Çerezler
                </h2>
                <p className="mb-6">
                  Kişisel verilerinizin gizliliğine önem veriyoruz. Sitemizi
                  kullanırken bazı kişisel verilerinizin toplanabileceğini ve
                  çerez (cookie) kullanılabileceğini lütfen unutmayın. Bu
                  konudaki detaylar için aşağıda yer alan Gizlilik Politikamızı
                  inceleyebilirsiniz. Siteyi kullanmaya devam ederek gizlilik
                  politikasında açıklanan veri uygulamalarını da kabul etmiş
                  olursunuz.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  7. Harici Bağlantılar
                </h2>
                <p className="mb-6">
                  Sitemizde başka web sitelerine yönlendiren bağlantılar
                  bulunabilir. Bu dış sitelerin içeriğinden veya bu sitelerin
                  kişisel verileri işleme uygulamalarından site sahibi sorumlu
                  değildir. Harici bir bağlantıya tıkladığınızda, o siteye ait
                  koşullar ve gizlilik politikaları geçerli olur.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  8. Sorumluluk Reddi
                </h2>
                <p className="mb-6">
                  Sitedeki içeriklerin doğruluğu, güncelliği ve eksiksizliği
                  için azami özen gösterilmekle birlikte, sunulan bilgilerin
                  doğruluğu veya belirli bir amaca uygunluğu konusunda açık ya
                  da örtük bir garanti verilmez. Finans, ekonomi ve yapay zeka
                  gibi alanlardaki yazılar sadece genel bilgilendirme amaçlıdır
                  ve hiçbir şekilde yatırım, finansal veya hukuki tavsiye
                  niteliği taşımaz. Bu nedenle, sitedeki bilgilere dayanarak
                  alınan kararların sorumluluğu kullanıcıya aittir. Site sahibi,
                  sitedeki içeriklerin kullanılması sonucunda doğabilecek
                  doğrudan veya dolaylı zararlardan sorumlu tutulamaz.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  9. Hizmet Sürekliliği
                </h2>
                <p className="mb-6">
                  Site sahibi, sitenin kesintisiz veya hatasız çalışacağına dair
                  bir taahhüt vermemektedir. Teknik arızalar, bakım çalışmaları
                  veya kontrolümüz dışı gelişen durumlar nedeniyle siteye erişim
                  zaman zaman aksayabilir veya içerikler değişebilir. Site
                  sahibi, sitenin veya içeriğin herhangi bir zaman diliminde
                  erişilebilir olmasını garanti etmez.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  10. Değişiklik Hakkı
                </h2>
                <p className="mb-6">
                  Site sahibi, bu Kullanım Politikası'nda her zaman değişiklik
                  yapma hakkını saklı tutar. Güncellenmiş koşullar site üzerinde
                  yayımlandığı anda yürürlüğe girer. Kullanıcıların, sitedeki
                  koşulları periyodik olarak gözden geçirmesi ve
                  değişikliklerden haberdar olması kendi sorumluluklarındadır.
                  Değişiklik sonrası sitenin kullanılmaya devam edilmesi,
                  güncellenen koşulların kabul edildiği anlamına gelir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  11. Uygulanacak Hukuk
                </h2>
                <p className="mb-6">
                  İşbu koşullar ve site kullanımından kaynaklanabilecek
                  uyuşmazlıklar Türkiye Cumhuriyeti yasalarına tabi olacak ve
                  ihtilaf halinde Türkiye mahkemeleri yetkili olacaktır.
                </p>

                <p className="text-sm text-gray-400 mt-8 pt-4 border-t border-gray-200">
                  Yürürlük Tarihi: 26 Nisan 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DisclaimerPage;
