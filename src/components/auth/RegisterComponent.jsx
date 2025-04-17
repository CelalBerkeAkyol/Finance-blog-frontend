import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearState } from "../../app/features/user/userSlice";
import { Button, Input, Checkbox, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "../../context/FeedbackContext";

export default function RegisterComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Feedback context'i kullan
  const { error: showError, success, warning } = useFeedback();

  const { isSuccess, isError, errorMessage, errorCode } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      warning("Parolalar eşleşmiyor. Lütfen kontrol ediniz.");
      return;
    }
    dispatch(registerUser(formData));
  };

  // Kayıt başarılı olduğunda yönlendirme ve state temizleme
  useEffect(() => {
    if (isSuccess) {
      success(
        "Hesabınız başarıyla oluşturuldu!\nE-postanızı kontrol ederek hesabınızı doğrulayın."
      );
      dispatch(clearState()); // State temizliği
      navigate("/");
    }

    if (isError) {
      // Auth_required hatası kullanıcıya gösterilmeyecek
      if (errorMessage && errorCode === "AUTH_REQUIRED") {
        // Sessizce işlem yap, kullanıcıya gösterme
        dispatch(clearState());
      } else {
        showError(errorMessage || "Kayıt işlemi sırasında bir hata oluştu.");
      }
    }

    return () => {
      dispatch(clearState()); // Component unmount olduğunda state sıfırlama
    };
  }, [
    isSuccess,
    isError,
    errorMessage,
    dispatch,
    navigate,
    success,
    showError,
  ]);

  return (
    <div className="flex h-full w-full items-center justify-center py-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 p-8 shadow-small">
        <div className="flex flex-col items-center pb-6">
          <p className="text-xl font-medium">Hoş Geldiniz</p>
          <p className="text-small text-default-500">
            Başlamak için bir hesap oluşturun
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Kullanıcı Adı"
            name="userName"
            placeholder="Kullanıcı adınızı girin"
            type="text"
            variant="bordered"
            onChange={handleChange}
          />

          <Input
            isRequired
            label="E-posta Adresi"
            name="email"
            placeholder="E-posta adresinizi girin"
            type="email"
            variant="bordered"
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Şifre"
            name="password"
            placeholder="Şifrenizi girin"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon={
                    isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"
                  }
                />
              </button>
            }
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Şifreyi Onayla"
            name="confirmPassword"
            placeholder="Şifrenizi tekrar girin"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon={
                    isConfirmVisible
                      ? "solar:eye-closed-linear"
                      : "solar:eye-bold"
                  }
                />
              </button>
            }
            onChange={handleChange}
          />

          <Checkbox isRequired className="py-4" size="sm">
            Kabul ediyorum&nbsp;
            <Link href="#" size="sm">
              Kullanım Koşulları
            </Link>
            &nbsp;ve&nbsp;
            <Link href="#" size="sm">
              Gizlilik Politikası
            </Link>
          </Checkbox>

          <Button
            className="bg-primary-600 text-white hover:bg-primary-700"
            type="submit"
          >
            Kayıt Ol
          </Button>
        </form>

        <p className="text-center text-small mt-4">
          Zaten bir hesabınız var mı?&nbsp;
          <Link href="/login" size="sm">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
