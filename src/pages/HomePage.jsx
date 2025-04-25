import BannerComponent from "../components/header/BannerComponent";
import CustomNavbar from "../components/header/CustomNavbar";
import HeroTail from "../components/tanıtım_page/Hero/HeroTail";
import SSFeatureComponent from "../components/tanıtım_page/SSFeatureComponent";
import CTASection from "../components/tanıtım_page/CTASection";
import NewsletterComponent from "../components/tanıtım_page/NewsletterComponent";
import FeatureComponent from "../components/tanıtım_page/FeatureComponent";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <BannerComponent />
      <CustomNavbar />

      <main className="flex-grow">
        <HeroTail />
        <CTASection />
        <SSFeatureComponent />

        <NewsletterComponent />
      </main>
    </div>
  );
}

export default HomePage;
