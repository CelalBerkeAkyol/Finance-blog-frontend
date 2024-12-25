import BannerComponent from "../components/header/BannerComponent";
import SignupComponent from "../components/auth/SignupComponent";
import CustomNavbar from "../components/header/CustomNavbar";
function SignupPage() {
  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <SignupComponent />
    </>
  );
}

export default SignupPage;
