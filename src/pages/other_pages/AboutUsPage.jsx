import React from "react";
import { Spacer, Card, CardBody, Divider, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import CustomNavbar from "../../components/header/CustomNavbar";

const AboutUsPage = () => {
  return (
    <>
      <CustomNavbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Başlık */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Hakkımda
        </h1>

        {/* Hakkımda Kartı */}
        <Card shadow="sm" className="p-6 bg-white">
          <CardBody>
            <p className="leading-relaxed">
              Merhaba, ben <strong>Celal Berke Akyol</strong>. Bilgisayar
              Mühendisliği öğrencisiyim ve kendimi Full Stack Web Geliştirme ile
              Veri Bilimi (Data Science) alanlarında geliştiriyorum. Özellikle
              tasarruf yöntemleri, farklı yatırım araçları, şirket haberleri ve
              finansal rapor analizleri gibi konulara ilgi duyuyorum.
            </p>
            <p className="pt-2 leading-relaxed">
              Bu blogda, finans ve ekonomi alanındaki araştırmalarımı
              <strong>
                {" "}
                Veri Bilimi ve Makine Öğrenmesi (Machine Learning){" "}
              </strong>{" "}
              yöntemleriyle analiz ederek sizlerle paylaşmayı hedefliyorum.
              Ayrıca, farklı alanlarda da Veri Bilimi ve Makine Öğrenmesi
              tekniklerini kullanarak gerçekleştirdiğim araştırmaları burada
              paylaşmayı planlıyorum.
            </p>
          </CardBody>
        </Card>

        <Spacer y={12} />
        {/* İletişim Bölümü */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📩 İletişim
        </h2>
        <Card shadow="sm" className="p-6 bg-white">
          <CardBody>
            <p className="text-gray-700 text-lg">
              Email:{" "}
              <a
                href="mailto:buscberke@gmail.com"
                className="text-blue-600 underline"
              >
                buscberke@gmail.com
              </a>
            </p>

            <p className="text-gray-700 text-lg flex items-center gap-2">
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/celal-berke-akyol-389a3a216/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <Icon icon="mdi:linkedin" width="20" className="mr-1" />{" "}
                Profilimi Görüntüle
              </a>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              GitHub:{" "}
              <a
                href="https://github.com/CelalBerkeAkyol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <Icon icon="mdi:github" width="20" className="mr-1" />{" "}
                Projelerime Göz At
              </a>
            </p>
          </CardBody>
        </Card>
        <Spacer y={12} />

        {/* Nasıl Destek Olabilirsiniz Bölümü */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          💡 Nasıl Destek Olabilirsiniz?
        </h2>
        <Card shadow="sm" className="p-6 bg-white">
          <CardBody>
            <ul className="list-none p-4 space-y-4">
              <li>
                📢 Postlarımızı sosyal medya hesaplarınızda paylaşabilirsiniz.
              </li>
              <li>
                🔎 Bize araştırma işi verebilir, veri analizine ihtiyacınız
                olduğunda bize ulaşabilirsiniz.
              </li>
              <li>
                💰 Projeye bağış yaparak daha fazla içerik üretmemizi
                destekleyebilirsiniz.
              </li>
              <li>
                💬 Bizi arkadaşlarınıza tavsiye ederek topluluğumuzun büyümesine
                katkıda bulunabilirsiniz.
              </li>
              <li>
                📝 Blog yazıları için konular önererek içerik üretimimize katkı
                sağlayabilirsiniz.
              </li>
            </ul>
          </CardBody>
        </Card>

        <Spacer y={12} />

        {/* Destek Butonu */}
        <div className="text-center">
          <Button
            color="primary"
            variant="shadow"
            className="px-6 py-3 text-lg"
            onPress={() =>
              window.open("https://www.buymeacoffee.com/celalberke", "_blank")
            }
          >
            🎁 Destek Ol
          </Button>
        </div>

        <Spacer y={8} />
      </div>
    </>
  );
};

export default AboutUsPage;
