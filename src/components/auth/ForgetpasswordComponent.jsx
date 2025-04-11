import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordUser, clearState } from "../../app/features/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function ForgetpasswordComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, errorMessage, errorCode } =
    useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ email: ""});


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
    dispatch(forgotPasswordUser(formData));
  };

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
