import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchUser } from "../../app/features/user/userSlice"; // fetchUser import edildi
import AdminNavbar from "../header/AdminNavbar"; // AdminNavbar bileşeni import edildi

export default function BannerComponent() {
  const dispatch = useDispatch();

  // Redux store'dan kullanıcı durumunu al
  const isAdmin = useSelector((state) => state.user.isAdmin);

  // Navbar ilk yüklendiğinde `fetchUser` çağrısını tetikle
  useEffect(() => {
    console.log("BannerComponent yüklenirken fetchUser çağrılıyor...");
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      {/* Eğer kullanıcı admin ise AdminNavbar'ı göster, değilse banner'ı göster */}
      {isAdmin ? (
        <AdminNavbar />
      ) : (
        <div className="flex w-full items-center justify-center gap-x-3 border-b-1 bg-gray-800 border-stone-200 border-divider bg-background/[0.15] px-6 py-2 backdrop-blur-xl sm:px-3.5 z-[9999]">
          <p className="text-small text-foreground text-white">
            <Link className="text-inherit" to="/about-us">
              Çalışmalarımızı beğeniyorsanız bize destek olabilirsiniz.&nbsp;
            </Link>
          </p>
          <Button
            as={Link}
            to="/about-us"
            className="group relative h-9 overflow-hidden bg-transparent text-small text-white font-normal"
            color="default"
            endContent={
              <Icon
                className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
                icon="solar:arrow-right-linear"
                width={16}
              />
            }
            variant="bordered"
          >
            Destek Ol
          </Button>
        </div>
      )}
    </>
  );
}
