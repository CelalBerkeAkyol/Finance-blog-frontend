import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordUser,
  clearState,
} from "../../app/features/user/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // token from URL
  const { isLoading, isError, isSuccess, errorMessage } = useSelector(
    (state) => state.user
  );
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(token ? 2 : 1); // Step 1: Verify code, Step 2: Set new password
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    token: token || "",
  });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (isSuccess) {
      navigate("/login"); // redirect to login after successful reset
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Doğrulama kodu onaylama
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError("");

    try {
      const response = await axios.post("/auth/verify-reset-code", {
        code: formData.code,
      });

      if (response.data.success) {
        // Kod doğrulandı, adım 2'ye geç ve token'ı sakla
        setFormData({ ...formData, token: response.data.data.token });
        setStep(2);
      }
    } catch (error) {
      setVerifyError(
        error.response?.data?.message || "Doğrulama kodu onaylanamadı."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // Şifre sıfırlama
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!formData.token) {
      setVerifyError(
        "Doğrulama token'ı eksik. Lütfen tekrar doğrulama kodu alın."
      );
      return;
    }

    dispatch(
      resetPasswordUser({
        token: formData.token,
        newPassword: formData.password,
      })
    );
  };

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
        {step === 1 ? (
          <>
            <p className="pb-2 text-xl font-medium">Doğrulama Kodunu Girin</p>
            <form className="flex flex-col gap-3" onSubmit={handleVerifyCode}>
              <Input
                label="Doğrulama Kodu"
                name="code"
                placeholder="E-postanıza gönderilen 6 haneli kodu girin"
                type="text"
                variant="bordered"
                value={formData.code}
                onChange={handleChange}
                required
              />
              {verifyError && (
                <p className="text-red-500 text-sm">{verifyError}</p>
              )}
              <Button
                className="bg-primary-600 text-white hover:bg-primary-700"
                type="submit"
                isDisabled={verifyLoading}
              >
                {verifyLoading ? "Doğrulanıyor..." : "Doğrula"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="pb-2 text-xl font-medium">Yeni Şifre Belirle</p>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleResetPassword}
            >
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
                name="password"
                placeholder="Yeni şifrenizi girin"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {isError && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <Button
                className="bg-primary-600 text-white hover:bg-primary-700"
                type="submit"
                isDisabled={isLoading}
              >
                {isLoading ? "İşleniyor..." : "Şifreyi Sıfırla"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
