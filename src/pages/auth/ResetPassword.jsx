import ResetPasswordComponent from "../../components/auth/ResetPasswordComponent";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";

function ResetPassword() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <ResetPasswordComponent />
    </>
  );
}

export default ResetPassword;
