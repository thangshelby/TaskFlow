import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return null;
  }
};

const AdminRoute = (): React.ReactElement => {
  const location = useLocation();
  const adminToken = localStorage.getItem("admin_token");

  // Always redirect back to admin dashboard when path is just /admin
  if (location.pathname === "/admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  const payload = parseJwt(adminToken);
  if (!payload) {
    localStorage.removeItem("admin_token");
    return <Navigate to="/admin/login" replace />;
  }

  const currentTime = Date.now() / 1000;
  if (payload.exp && payload.exp < currentTime) {
    localStorage.removeItem("admin_token");
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
