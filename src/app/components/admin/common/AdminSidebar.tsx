import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  Tag,
  Workflow,
  ListChecks,
  AlertTriangle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  badge?: number;
  children?: { label: string; icon: React.ReactNode; to: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    to: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: <Users className="h-5 w-5" />,
    to: "/admin/users",
  },
  {
    label: "Projects",
    icon: <FolderOpen className="h-5 w-5" />,
    to: "/admin/projects",
  },
  {
    label: "Roles & Permissions",
    icon: <Shield className="h-5 w-5" />,
    to: "/admin/roles",
  },
  {
    label: "Configuration",
    icon: <Settings className="h-5 w-5" />,
    children: [
      {
        label: "Issue Types",
        icon: <Tag className="h-4 w-4" />,
        to: "/admin/configuration/issue-types",
      },
      {
        label: "Priorities",
        icon: <AlertTriangle className="h-4 w-4" />,
        to: "/admin/configuration/priorities",
      },
      {
        label: "Statuses",
        icon: <ListChecks className="h-4 w-4" />,
        to: "/admin/configuration/statuses",
      },
      {
        label: "Workflows",
        icon: <Workflow className="h-4 w-4" />,
        to: "/admin/configuration/workflows",
      },
    ],
  },
  {
    label: "Audit Logs",
    icon: <Activity className="h-5 w-5" />,
    to: "/admin/audit-logs",
  },
];

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Configuration"]);
  const navigate = useNavigate();

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-emerald-500/15 text-emerald-400 shadow-inner"
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    }`;

  return (
    <div
      className={`relative flex flex-col h-screen bg-slate-900 border-r border-slate-700/50 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 shadow-lg shadow-emerald-500/30">
              <span className="text-sm font-black text-white">T</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-100">TaskFlow</span>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
                Admin Portal
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 shadow-lg shadow-emerald-500/30 mx-auto">
            <span className="text-sm font-black text-white">T</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-14 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-400 hover:text-slate-200 shadow-md transition-all"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const isGroupExpanded = expandedGroups.includes(item.label);
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all duration-150 ${
                    collapsed ? "justify-center" : "justify-between"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (
                    isGroupExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </button>

                {!collapsed && isGroupExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-slate-700/60 pl-3">
                    {item.children.map((child) => (
                      <NavLink key={child.to} to={child.to} className={navLinkClass}>
                        {child.icon}
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-slate-700/50 p-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
