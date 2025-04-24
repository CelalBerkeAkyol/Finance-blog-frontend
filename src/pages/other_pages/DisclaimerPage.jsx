import React from "react";
import CustomNavbar from "../../components/header/CustomNavbar";

const DisclaimerPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <div className="bg-white py-2 mb-12 min-h-full">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-sky-950 to-lime-900 text-white py-4 px-4 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold">Feragatname</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300">
                İçeriklerimizin kullanımına ilişkin yasal uyarılar ve sorumluluk
                sınırları
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600">
                <p className="mb-6">
                  Cassandra tarafından paylaşılan tüm finansal analizler,
                  istatistiksel veriler, yorumlar ve kod örnekleri yalnızca
                  bilgilendirme amaçlıdır. Bu içerikler yatırım tavsiyesi,
                  finansal danışmanlık veya profesyonel öneri yerine geçmez.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  1. İçerik Doğruluğu ve Güncellik
                </h2>
                <p className="mb-6">
                  Blogda yer alan içerikler, yayınlandıkları anda doğru kabul
                  edilse de zamanla değişen piyasa koşulları, yasal düzenlemeler
                  veya yeni bilgiler ışığında güncelliğini yitirebilir. Bu
                  nedenle, herhangi bir finansal işlem yapmadan önce güncel
                  araştırma yapmanız önerilir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  2. Sorumluluk Reddi
                </h2>
                <p className="mb-6">
                  Cassandra, paylaşılan bilgilerin doğruluğu, eksiksizliği veya
                  güncelliği konusunda hiçbir garanti vermez. Yayınlanan
                  içerikler, kişisel deneyimlere ve araştırmalara dayanmaktadır;
                  dolayısıyla oluşabilecek her türlü zarardan Cassandra sorumlu
                  tutulamaz.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  3. Yatırım Tavsiyesi Olmaması
                </h2>
                <p className="mb-6">
                  Blogumuzda yer alan finansal analizler, piyasa yorumları ve
                  kod örnekleri yatırım tavsiyesi olarak değerlendirilmemelidir.
                  Herhangi bir yatırım kararı almadan önce, lütfen bağımsız
                  finansal danışmanlık hizmeti alınız.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  4. Üçüncü Taraf İçerikler
                </h2>
                <p className="mb-6">
                  Blogda, üçüncü taraf sitelere veya kaynaklara verilen
                  bağlantılar yer alabilir. Bu bağlantıların içerikleri,
                  doğruluğu ve güncelliği üzerinde Cassandra herhangi bir
                  sorumluluk kabul etmez.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">
                  5. Kullanım Koşulları
                </h2>
                <p className="mb-6">
                  Blogda yer alan tüm içeriklerin kullanımı, ilgili yasal
                  düzenlemeler çerçevesinde gerçekleştirilmektedir.
                  Kullanıcılar, bu içerikleri okuma, paylaşma veya referans alma
                  konusunda sorumluluklarını bilerek hareket etmelidir.
                </p>

                <h2 className="text-xl font-bold mt-8 mb-3">6. İletişim</h2>
                <p className="mb-6">
                  Feragatname veya içeriklerle ilgili sorularınız için lütfen{" "}
                  <a
                    href="mailto:info@learndeepinvest.com"
                    className="text-primary hover:underline"
                  >
                    info@learndeepinvest.com
                  </a>{" "}
                  adresi üzerinden bize ulaşınız.
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

export default DisclaimerPage;
