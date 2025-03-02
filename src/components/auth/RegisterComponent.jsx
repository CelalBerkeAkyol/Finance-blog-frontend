import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../app/features/user/userSlice";

export default function RegisterComponent() {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState(null);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);

    try {
      const response = await dispatch(
        registerUser({ userName, email, password })
      ).unwrap();
      console.log("Registration successful:", response);
      // Kayıt sonrası yönlendirme veya bildirim ekleyebilirsiniz.
    } catch (err) {
      console.error("Registration failed:", err);
      // Hata durumunda kullanıcıya bildirim ekleyebilirsiniz.
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center py-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col items-center pb-6">
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-small text-default-500">
            Create an account to get started
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Input
              isRequired
              classNames={{
                base: "-mb-[2px]",
                inputWrapper:
                  "rounded-b-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
              }}
              label="Username"
              name="username"
              placeholder="Enter your username"
              type="text"
              variant="bordered"
            />

            <Input
              isRequired
              classNames={{
                base: "-mb-[2px]",
                inputWrapper:
                  "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
              }}
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
            />

            <Input
              isRequired
              classNames={{
                base: "-mb-[2px]",
                inputWrapper:
                  "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
              }}
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
            />

            <Input
              isRequired
              classNames={{
                inputWrapper: "rounded-t-none",
              }}
              endContent={
                <button type="button" onClick={toggleConfirmVisibility}>
                  {isConfirmVisible ? (
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
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Checkbox isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>
          <Button color="primary" type="submit">
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
          <Link href="#" size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
