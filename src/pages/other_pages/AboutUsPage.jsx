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
          Hakkımızda
        </h1>

        {/* Hakkımda Kartı */}
        <Card shadow="sm" className="p-6 bg-white">
          <CardBody>
            <p className="leading-relaxed">
              Bu platform, <strong>Celal&nbsp;Berke&nbsp;Akyol</strong>{" "}
              tarafından geliştirilmiştir ve yatırım ilgililerine veri temelli,
              analiz içerikler sunmayı amaçlar.
            </p>

            <p className="pt-2 leading-relaxed">
              Yatırım kararlarının sezgilere değil,{" "}
              <strong>kanıta dayalı</strong> ve
              <strong> bilimsel</strong> yöntemlere dayanması gerektiğine
              inanıyoruz. Bu nedenle finansal verileri <strong>Python</strong>{" "}
              ve modern veri bilimi araçlarıyla analiz ediyoruz.
            </p>

            <p className="pt-2 leading-relaxed">
              Blogumuzda; makroekonomik göstergelerden şirket değerlemelerine,
              portföy optimizasyonundan risk yönetimine kadar geniş bir
              yelpazede
              <strong> Veri Bilimi</strong> ve
              <strong> Makine Öğrenmesi</strong> teknikleriyle hazırlanmış
              içerikler bulacaksınız.
            </p>

            <p className="pt-2 leading-relaxed">
              Burada paylaşılan hiçbir içerik <strong>yatırım tavsiyesi</strong>{" "}
              niteliği taşımaz. Karar vermeden önce lütfen kendi araştırmanızı
              yapın veya yetkin bir danışmana başvurun.
            </p>
          </CardBody>
        </Card>
        {/* KİMLER İÇİN UYGUNDUR? */}
        <Card shadow="sm" className="p-6 bg-white mt-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">
              Kimler İçin Uygundur?
            </h2>

            <p className="leading-relaxed">
              Platformumuz, yatırım kararlarını <strong>veri odaklı</strong>{" "}
              yaklaşımlarla güçlendirmek isteyen herkesi hedefler. Özellikle:
            </p>

            <ul className="list-disc pl-6 pt-2 space-y-1 leading-relaxed">
              <li>
                Finansal okuryazarlığını geliştirmeyi amaçlayan bireysel
                yatırımcılar
              </li>
              <li>
                Ekonomi, finans veya veri bilimi alanında kendini geliştiren
                öğrenciler
              </li>
              <li>
                Python ve veri bilimi araçlarını yatırım analizine uygulamak
                isteyen profesyoneller
              </li>
              <li>
                Derin öğrenme ve makine öğrenmesiyle portföy optimizasyonu, risk
                analizi vb. modeller kurmak isteyen araştırmacılar
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* KİMLER İÇİN UYGUN DEĞİLDİR? */}
        <Card shadow="sm" className="p-6 bg-white mt-6">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">
              Kimler İçin Uygun Değildir?
            </h2>

            <p className="leading-relaxed">
              Aşağıdaki beklentilere sahip kullanıcılar bu platformdan
              aradıkları faydayı göremeyebilir:
            </p>

            <ul className="list-disc pl-6 pt-2 space-y-1 leading-relaxed">
              <li>
                Hızlı ve garantili kâr sağlayacak “hazır al-sat sinyalleri”
                arayanlar
              </li>
              <li>
                Veri analizi ve temel araştırma süreçlerine zaman ayırmak
                istemeyenler
              </li>
              <li>
                Bilimsel yönteme dayalı karar almaktansa yalnızca sezgiyle
                hareket edenler
              </li>
              <li>
                Finansal sorumluluğu tamamen üçüncü kişilere devretmek
                isteyenler
              </li>
            </ul>
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
              Geliştirici mail{" "}
              <a
                href="mailto:buscberke@gmail.com"
                className="text-blue-600 underline"
              >
                buscberke@gmail.com
              </a>
            </p>

            <p className="text-gray-700 text-lg flex items-center gap-2">
              Geliştirici Linkedin{" "}
              <a
                href="https://www.linkedin.com/in/celal-berke-akyol-389a3a216/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <Icon icon="mdi:linkedin" width="20" className="mr-1" /> Celal
                Berke Akyol
              </a>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              Web sitesinin kaynak kodları{" "}
              <a
                href="https://github.com/CelalBerkeAkyol/cassandra-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <Icon icon="mdi:github" width="20" className="mr-1" /> Cassandra
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
              <li> İçeriklerimizi paylaşabilirsiniz.</li>

              <li>
                Projeye bağış yaparak daha fazla içerik üretmemizi
                destekleyebilirsiniz.
              </li>

              <li>
                Blog yazıları için konular önererek içerik üretimimize katkı
                sağlayabilirsiniz.
              </li>
              <li>
                Yapıcı yorumlarınızı paylaşarak içeriklerimizi
                geliştirebilirsiniz.
              </li>
            </ul>
          </CardBody>
        </Card>

        <Spacer y={12} />
      </div>
    </>
  );
};

export default AboutUsPage;
