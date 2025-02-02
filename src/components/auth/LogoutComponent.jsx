// src/components/LogoutComponent.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, clearState } from "../../app/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

const LogoutComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, errorMessage } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    // Component mount olduğunda logout isteğini tetikle
    dispatch(logoutUser());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      console.info("LogoutComponent: Çıkış başarılı, yönlendiriliyor.");
      dispatch(clearState());
      navigate("/blog-admin/login");
    }
    if (isError) {
      console.error("LogoutComponent: Çıkış hatası:", errorMessage);
    }
  }, [isSuccess, isError, errorMessage, dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {isLoading ? (
        <p>Çıkış yapılıyor...</p>
      ) : (
        <Button onClick={() => dispatch(logoutUser())}>Çıkış Yap</Button>
      )}
      {isError && <p style={{ color: "red" }}>Hata: {errorMessage}</p>}
    </div>
  );
};

export default LogoutComponent;
