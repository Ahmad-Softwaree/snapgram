import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import TopBar from "@/components/shared/TopBar";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { checkAuthUser } = useUserContext();
  useEffect(() => {
    checkAuthUser();
  }, []);
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSideBar />
      <section className="flex flex-1 w-full">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
