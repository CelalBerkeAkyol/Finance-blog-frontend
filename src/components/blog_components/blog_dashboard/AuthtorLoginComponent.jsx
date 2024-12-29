import React, { useState } from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import axios from "../../../api"; // Axios yapılandırmasını import ediyoruz
import { useNavigate } from "react-router-dom";

export default function AuthorLoginComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıyoruz
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Login isteği
      const response = await axios.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        navigate("/blog-admin/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.error ||
            "Giriş başarısız. Bilgilerinizi kontrol edin."
        );
      } else {
        setErrorMessage(
          "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Log In</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <Button color="primary" type="submit" isDisabled={isLoading}>
            {isLoading ? "Loading..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
