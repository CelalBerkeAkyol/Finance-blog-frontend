import BannerComponent from "../components/header/BannerComponent";
import CustomNavbar from "../components/header/CustomNavbar";
import HeroTail from "../components/tanıtım_page/Hero/HeroTail";
import SSFeatureComponent from "../components/tanıtım_page/SSFeatureComponent";
import LogoComponent from "../components/tanıtım_page/LogoComponent";
import CTASection from "../components/tanıtım_page/CTASection";
import BlogComponent from "../components/tanıtım_page/BlogComponent";
import NewsletterComponent from "../components/tanıtım_page/NewsletterComponent";
import FeatureComponent from "../components/tanıtım_page/FeatureComponent";
import Footer from "../components/footer/Footer";
function HomePage() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <HeroTail />
      <SSFeatureComponent />
      <FeatureComponent />
      <LogoComponent />
      <CTASection />
      <BlogComponent />
      <NewsletterComponent />
      <Footer />
    </>
  );
}

export default HomePage;
