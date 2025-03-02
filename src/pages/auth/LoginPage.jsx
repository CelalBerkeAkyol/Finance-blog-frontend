import AuthorLoginComponent from "../../components/auth/AuthtorLoginComponent";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function LoginPage() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <AuthorLoginComponent />
    </>
  );
}

export default LoginPage;
