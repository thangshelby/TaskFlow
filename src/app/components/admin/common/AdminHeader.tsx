import React from "react";
import { Bell, Search, ChevronRight, Home } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  users: "Users",
  projects: "Projects",
  roles: "Roles & Permissions",
  configuration: "Configuration",
  "issue-types": "Issue Types",
  priorities: "Priorities",
  statuses: "Statuses",
  workflows: "Workflows",
  "audit-logs": "Audit Logs",
  system: "System Settings",
};

const AdminHeader: React.FC = () => {
  const location = useLocation();

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => ({
      label: BREADCRUMB_MAP[seg] ?? seg,
      path: "/" + arr.slice(0, idx + 1).join("/"),
    }));

  return (
    <header className="flex items-center justify-between border-b border-slate-200/60 bg-white px-6 py-3.5 shadow-sm shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link
          to="/admin/dashboard"
          className="flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg.path}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            {idx === segments.length - 1 ? (
              <span className="font-semibold text-slate-800">{seg.label}</span>
            ) : (
              <Link
                to={seg.path}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                {seg.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none w-56 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
            <span className="text-xs font-bold">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Admin</p>
            <p className="text-[10px] text-emerald-600 font-medium">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
