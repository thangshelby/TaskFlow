import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@libs/app/components/admin/common/AdminSidebar";
import AdminHeader from "@libs/app/components/admin/common/AdminHeader";

const AdminLayout = (): React.ReactElement => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
