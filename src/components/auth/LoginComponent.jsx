import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearState } from "../../app/features/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, errorMessage, token } = useSelector(
    (state) => state.user
  );
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isSuccess || token) {
      console.info("LoginComponent: Giriş başarılı, yönlendiriliyor.");
      navigate("/blog/posts");
    }
    if (isError) {
      console.error("LoginComponent: Giriş hatası:", errorMessage);
      // Hata bildirimi ekleyebilirsiniz.
    }
    // Cleanup kısmını kaldırıyoruz, böylece kullanıcı state'i korunuyor.
    // return () => {
    //   dispatch(clearState());
    // };
  }, [isSuccess, isError, token, errorMessage, navigate, dispatch]);

  return (
    <div className="flex h-full w-full items-center justify-center pt-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Sign in to your account</h1>
          <p className="text-small text-default-500">to continue to Acme</p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />

          <Input
            isRequired
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

          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In"}
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
            Continue with Google
          </Button>
          <Button
            startContent={
              <Icon className="text-default-500" icon="fe:github" width={24} />
            }
            variant="bordered"
          >
            Continue with Github
          </Button>
        </div>

        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="#" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
