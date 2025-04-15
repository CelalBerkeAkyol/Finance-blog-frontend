import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPasswordUser,
  clearState,
} from "../../app/features/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function ForgetpasswordComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, errorMessage, errorCode } =
    useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [emailSent, setEmailSent] = useState(false);

  // Clears temporary authentication state when the component unmounts.
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  // Başarılı email gönderimi sonrası
  useEffect(() => {
    if (isSuccess) {
      setEmailSent(true);
    }
  }, [isSuccess]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordUser(formData));
  };

  const handleVerifyCodeClick = () => {
    navigate("/reset");
  };

  if (emailSent) {
    return (
      <div className="flex h-full justify-center my-14">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Email Gönderildi</p>
          <div className="flex flex-col gap-3">
            <p className="text-gray-700">
              Şifre sıfırlama kodunuz <strong>{formData.email}</strong> adresine
              gönderildi. Lütfen e-postanızı kontrol edin ve sıfırlama işlemine
              devam etmek için gelen 6 haneli kodu giriniz.
            </p>
            <Button
              className="bg-primary-600 text-white hover:bg-primary-700 mt-4"
              onClick={handleVerifyCodeClick}
            >
              Doğrulama Kodunu Gir
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Forgot Password</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            label="email"
            name="email"
            placeholder="Enter your email"
            type="text"
            variant="bordered"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Button
            className="bg-primary-600 text-white hover:bg-primary-700"
            type="submit"
            isDisabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
