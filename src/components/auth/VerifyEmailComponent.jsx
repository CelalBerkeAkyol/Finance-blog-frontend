import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearState } from "../../app/features/user/userSlice";
import ErrorComponent from "../error/ErrorComponent";
import BannerComponent from "../header/BannerComponent";
import CustomNavbar from "../header/CustomNavbar";

export default function VerifyEmailComponent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      try {
        const response = await fetch(
          `${API_URL}/blog/auth/verify-email?token=${token}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        dispatch(clearState());
      }
    };

    verifyEmail();
  }, [dispatch]);

  if (loading) {
    return <p>Validating your email...</p>;
  }

  if (error) {
    return (
      <>
        <BannerComponent />
        <CustomNavbar />
        <ErrorComponent
          message={error}
          title="Email Verification Failed"
          code="VERIFICATION_ERROR"
          onAction={() => (window.location.href = "/")}
          actionText="Go to Homepage"
        />
      </>
    );
  }

  return (
    <>
      <BannerComponent />
      <CustomNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
            Email Verification Successful!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Your email has been successfully verified. You can now proceed to
            use your account.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </>
  );
}
