import { Header } from "@libs/app/components/general-components/user/header";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default DefaultLayout;
