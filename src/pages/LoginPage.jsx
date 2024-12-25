import BannerComponent from "../components/header/BannerComponent";
import LoginComponent from "../components/auth/LoginComponent";
import CustomNavbar from "../components/header/CustomNavbar";
function LoginPage() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <LoginComponent />
    </>
  );
}

export default LoginPage;
