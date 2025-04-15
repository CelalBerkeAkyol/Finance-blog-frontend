import { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";

export default function ResetPasswordComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({
    message: "",
    type: "", // success, error
  });
  const [validationErrors, setValidationErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Check if token and email are provided
  useEffect(() => {
    if (!formData.email || !formData.token) {
      setStatus({
        message:
          "Geçersiz veya eksik sıfırlama bilgisi. Lütfen tekrar deneyin veya yeni bir sıfırlama bağlantısı talep edin.",
        type: "error",
      });
    }
  }, [formData.email, formData.token]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleVisibilityConfirm = () => {
    setIsVisibleConfirm(!isVisibleConfirm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation errors when user types
    if (name === "newPassword" || name === "confirmPassword") {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      newPassword: "",
      confirmPassword: "",
    };

    // Password validation
    if (formData.newPassword.length < 8) {
      errors.newPassword = "Şifre en az 8 karakter uzunluğunda olmalıdır";
      isValid = false;
    }

    // Confirm password validation
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setStatus({
          message:
            response.data.message ||
            "Şifreniz başarıyla sıfırlandı! Yeni şifrenizle giriş yapabilirsiniz.",
          type: "success",
        });

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
        <p className="pb-2 text-xl font-medium">Şifreyi Sıfırla</p>

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

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            label="E-posta"
            name="email"
            type="email"
            variant="bordered"
            value={formData.email}
            onChange={handleChange}
            isDisabled={true}
            required
          />

          <Input
            endContent={
              <button
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
              >
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Yeni Şifre"
            name="newPassword"
            placeholder="Yeni şifrenizi girin"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={formData.newPassword}
            onChange={handleChange}
            isInvalid={!!validationErrors.newPassword}
            errorMessage={validationErrors.newPassword}
            required
          />

          <Input
            endContent={
              <button
                type="button"
                onClick={toggleVisibilityConfirm}
                className="focus:outline-none"
              >
                {isVisibleConfirm ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Şifreyi Onayla"
            name="confirmPassword"
            placeholder="Yeni şifrenizi tekrar girin"
            type={isVisibleConfirm ? "text" : "password"}
            variant="bordered"
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={!!validationErrors.confirmPassword}
            errorMessage={validationErrors.confirmPassword}
            required
          />

          <Button
            className="bg-primary-600 text-white hover:bg-primary-700 mt-2"
            type="submit"
            isDisabled={isLoading || !formData.email || !formData.token}
          >
            {isLoading ? "İşleniyor..." : "Şifreyi Sıfırla"}
          </Button>
        </form>
      </div>
    </div>
  );
}
