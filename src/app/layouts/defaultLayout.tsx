import { Header } from "@libs/app/components/general-components/user/header";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DefaultLayout = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen flex-col">
      {location.pathname.length < 10 && (
        <Header />
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default DefaultLayout;
