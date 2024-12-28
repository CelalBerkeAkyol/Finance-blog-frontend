import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function AuthorLoginComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch("http://localhost:3000/blog/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username, // Backend'de `username` olarak tanımlanmış
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Başarılı giriş
        localStorage.setItem("authToken", data.token); // Token saklanır
        alert("Başarılı bir şekilde giriş yaptın");
        // window.location.href = data.redirect_url; // Yönlendirme yapılır
      } else {
        // Hata mesajı
        setErrorMessage(
          data.error || "Giriş başarısız. Bilgilerinizi kontrol edin."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin."
      );
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
            label="user name "
            name="username"
            placeholder="Enter your username"
            type="username"
            variant="bordered"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
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

          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button color="primary" type="submit" isDisabled={isLoading}>
            {isLoading ? "Loading..." : "Log In"}
          </Button>
        </form>
        <div className="flex items-center gap-4 py-2"></div>
      </div>
    </div>
  );
}
