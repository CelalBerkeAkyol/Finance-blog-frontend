import RegisterComponent from "../../components/auth/RegisterComponent";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function RegisterPage() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <RegisterComponent />
    </>
  );
}

export default RegisterPage;
