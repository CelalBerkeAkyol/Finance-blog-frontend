import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function ForgetpasswordComponent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: verification code
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({
    message: "",
    type: "", // success, error
  });
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value.trim());
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.success) {
        setStatus({
          message:
            "Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
          type: "success",
        });
        setStep(2);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0] ||
        "Bir hata oluştu. Lütfen tekrar deneyin.";

      if (error.response?.status === 429) {
        // Rate limit error
        setStatus({
          message: errorMessage,
          type: "error",
        });
      } else if (error.response?.status === 403) {
        // Account deactivated
        setStatus({
          message: errorMessage,
          type: "error",
        });
      } else {
        setStatus({
          message: errorMessage,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await api.post("/auth/verify-reset-code", {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        setToken(response.data.data.token);
        setStatus({
          message:
            "Doğrulama başarılı. Şifre sıfırlama sayfasına yönlendiriliyorsunuz.",
          type: "success",
        });

        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate(
            `/reset?email=${encodeURIComponent(
              email
            )}&token=${encodeURIComponent(response.data.data.token)}`
          );
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0] ||
        "Bir hata oluştu. Lütfen tekrar deneyin.";

      if (error.response?.data?.error?.code === "INVALID_CODE") {
        // Track remaining attempts if available
        const newRemainingAttempts = remainingAttempts - 1;
        setRemainingAttempts(newRemainingAttempts);

        setStatus({
          message: `${errorMessage} (${newRemainingAttempts} deneme hakkınız kaldı)`,
          type: "error",
        });
      } else if (
        error.response?.data?.error?.code === "MAX_ATTEMPTS_EXCEEDED"
      ) {
        setStatus({
          message: errorMessage,
          type: "error",
        });
        // Reset to email step
        setStep(1);
        setRemainingAttempts(5);
      } else if (
        error.response?.data?.error?.code === "INVALID_OR_EXPIRED_TOKEN"
      ) {
        setStatus({
          message: errorMessage,
          type: "error",
        });
        // Reset to email step
        setStep(1);
        setRemainingAttempts(5);
      } else {
        setStatus({
          message: errorMessage,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.success) {
        setStatus({
          message: "Yeni doğrulama kodu e-posta adresinize gönderildi.",
          type: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0] ||
        "Bir hata oluştu. Lütfen tekrar deneyin.";

      setStatus({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">
          {step === 1 ? "Şifremi Unuttum" : "Doğrulama Kodu"}
        </p>

        {status.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              status.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {status.message}
          </div>
        )}

        {step === 1 ? (
          <form className="flex flex-col gap-3" onSubmit={handleEmailSubmit}>
            <Input
              label="E-posta"
              name="email"
              placeholder="E-posta adresinizi girin"
              type="email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
              required
            />

            <p className="text-sm text-gray-500 mt-1">
              E-posta adresinizi girin ve şifrenizi sıfırlamak için size bir
              doğrulama kodu göndereceğiz.
            </p>

            <Button
              className="bg-primary text-white hover:bg-secondary mt-2"
              type="submit"
              isDisabled={isLoading}
            >
              {isLoading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
            </Button>

            <div className="text-center mt-2">
              <Button
                className="text-primary"
                type="button"
                variant="light"
                onClick={() => navigate("/login")}
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={handleVerificationSubmit}
          >
            <Input
              label="E-posta"
              name="email"
              type="email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
              isDisabled={true}
              required
            />

            <Input
              label="Doğrulama Kodu"
              name="verificationCode"
              placeholder="E-postadaki doğrulama kodunu girin"
              type="text"
              variant="bordered"
              value={verificationCode}
              onChange={handleCodeChange}
              required
            />

            <p className="text-sm text-gray-500 mt-1">
              E-posta adresinize gönderilen doğrulama kodunu girin. Kod sınırlı
              bir süre geçerlidir.
            </p>

            <Button
              className="bg-primary text-white hover:bg-secondary mt-2"
              type="submit"
              isDisabled={isLoading}
            >
              {isLoading ? "Doğrulanıyor..." : "Doğrula ve Devam Et"}
            </Button>

            <div className="flex justify-between mt-2">
              <Button
                className="text-primary"
                type="button"
                variant="light"
                onClick={() => {
                  setStep(1);
                  setVerificationCode("");
                  setStatus({ message: "", type: "" });
                }}
              >
                Geri
              </Button>

              <Button
                className="text-primary"
                type="button"
                variant="light"
                onClick={handleResendCode}
                isDisabled={isLoading}
              >
                Kodu Yeniden Gönder
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
