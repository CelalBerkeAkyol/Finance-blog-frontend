import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordUser, clearState } from "../../app/features/user/userSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // token from URL
  const { isLoading, isError, isSuccess, errorMessage } = useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ password: "" });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPasswordUser({ token, password: formData.password }));
  };

  return (
    <div className="flex h-full justify-center my-14">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-gray-50 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Reset Password</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            endContent={
              <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                {isVisible ? (
                  <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                ) : (
                  <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                )}
              </button>
            }
            label="New Password"
            name="password"
            placeholder="Enter new password"
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
            {isLoading ? "Loading..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
