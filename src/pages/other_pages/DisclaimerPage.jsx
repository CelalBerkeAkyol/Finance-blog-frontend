import React from "react";
import { Spacer } from "@nextui-org/react";

const DisclaimerPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-center text-4xl font-bold mb-4">Feragatname</h1>

      <p>
        [Blog Adınız] tarafından paylaşılan tüm finansal analizler,
        istatistiksel veriler, yorumlar ve kod örnekleri yalnızca bilgilendirme
        amaçlıdır. Bu içerikler yatırım tavsiyesi, finansal danışmanlık veya
        profesyonel öneri yerine geçmez.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        1. İçerik Doğruluğu ve Güncellik
      </h2>
      <p>
        Blogda yer alan içerikler, yayınlandıkları anda doğru kabul edilse de
        zamanla değişen piyasa koşulları, yasal düzenlemeler veya yeni bilgiler
        ışığında güncelliğini yitirebilir. Bu nedenle, herhangi bir finansal
        işlem yapmadan önce güncel araştırma yapmanız önerilir.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">2. Sorumluluk Reddi</h2>
      <p>
        [Blog Adınız], paylaşılan bilgilerin doğruluğu, eksiksizliği veya
        güncelliği konusunda hiçbir garanti vermez. Yayınlanan içerikler,
        kişisel deneyimlere ve araştırmalara dayanmaktadır; dolayısıyla
        oluşabilecek her türlü zarardan [Blog Adınız] sorumlu tutulamaz.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        3. Yatırım Tavsiyesi Olmaması
      </h2>
      <p>
        Blogumuzda yer alan finansal analizler, piyasa yorumları ve kod
        örnekleri yatırım tavsiyesi olarak değerlendirilmemelidir. Herhangi bir
        yatırım kararı almadan önce, lütfen bağımsız finansal danışmanlık
        hizmeti alınız.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">
        4. Üçüncü Taraf İçerikler
      </h2>
      <p>
        Blogda, üçüncü taraf sitelere veya kaynaklara verilen bağlantılar yer
        alabilir. Bu bağlantıların içerikleri, doğruluğu ve güncelliği üzerinde
        [Blog Adınız] herhangi bir sorumluluk kabul etmez.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">5. Kullanım Koşulları</h2>
      <p>
        Blogda yer alan tüm içeriklerin kullanımı, ilgili yasal düzenlemeler
        çerçevesinde gerçekleştirilmektedir. Kullanıcılar, bu içerikleri okuma,
        paylaşma veya referans alma konusunda sorumluluklarını bilerek hareket
        etmelidir.
      </p>
      <Spacer y={1} />

      <h2 className="text-2xl font-bold mt-6 mb-2">6. İletişim</h2>
      <p>
        Feragatname veya içeriklerle ilgili sorularınız için lütfen{" "}
        <a href="mailto:ornek@example.com" className="text-blue-500">
          ornek@example.com
        </a>
        adresi üzerinden bize ulaşınız.
      </p>
    </div>
  );
};

export default DisclaimerPage;
