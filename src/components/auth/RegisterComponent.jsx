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

  const { isSuccess, isError, errorMessage } = useSelector(
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
      navigate("/"); // Login sayfasına yönlendirme
    }

    if (isError) {
      showError(errorMessage || "Kayıt işlemi sırasında bir hata oluştu.");
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
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-small text-default-500">
            Create an account to get started
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Username"
            name="userName"
            placeholder="Enter your userName"
            type="text"
            variant="bordered"
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
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
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
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
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp;and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>

          <Button
            className="bg-primary-600 text-white hover:bg-primary-700"
            type="submit"
          >
            Sign Up
          </Button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Sign Up with Google
          </Button>
          <Button
            startContent={
              <Icon className="text-default-500" icon="fe:github" width={24} />
            }
            variant="bordered"
          >
            Sign Up with Github
          </Button>
        </div>

        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link href="/login" size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
