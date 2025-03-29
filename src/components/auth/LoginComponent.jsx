import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearState } from "../../app/features/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, errorMessage, errorCode } =
    useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Redirects to the home page when `isSuccess` becomes true.
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  // Clears temporary authentication state when the component unmounts.
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Log In</p>
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
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isError &&
            (errorCode === "USER_NOT_FOUND" ||
              errorCode === "INVALID_PASSWORD" ||
              errorCode === "SERVER_ERROR" ||
              errorCode === "ACCOUNT_DEACTIVATED") && (
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
          <Button
            className="bg-primary-600 text-white hover:bg-primary-700"
            type="submit"
            isDisabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
