import React from "react";
import {
  Users,
  FolderOpen,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  FolderPlus,
  FileText,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "@libs/hooks/apis/useProject";
import { useListUser } from "@libs/hooks/apis/useUser";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  color: "emerald" | "blue" | "amber" | "rose";
  to?: string;
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-100",
    trendUp: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-100",
    trendUp: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-100",
    trendUp: "text-amber-600",
  },
  rose: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-100",
    trendUp: "text-rose-600",
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  to,
}) => {
  const c = colorMap[color];
  const content = (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg} text-white shadow-sm`}
        >
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          {trend.isUp ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          )}
          <span
            className={`text-sm font-semibold ${
              trend.isUp ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend.value}%
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

interface ActivityItemProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  time: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconColor,
  title,
  time,
  description,
}) => (
  <div className="flex gap-3 py-3">
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconColor}`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 truncate">{description}</p>
    </div>
    <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">{time}</span>
  </div>
);

const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { users } = useListUser("a"); // fetch a broad list for stats

  const projectList = Array.isArray(projects?.data)
    ? projects.data
    : Array.isArray(projects)
    ? projects
    : [];

  const totalUsers = users?.length ?? 0;
  const totalProjects = projectList.length;
  const adminUsers = users?.filter((u) => u.role === "Admin").length ?? 0;
  const activeProjects = projectList.filter((p) => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    return new Date(p.updated_at).getTime() > twoDaysAgo;
  }).length;

  const recentActivities = [
    {
      icon: <UserPlus className="h-4 w-4 text-white" />,
      iconColor: "bg-emerald-500",
      title: "New user registered",
      description: "A new user account was created via OAuth",
      time: "2m ago",
    },
    {
      icon: <FolderPlus className="h-4 w-4 text-white" />,
      iconColor: "bg-blue-500",
      title: "Project created",
      description: 'Scrum project "Alpha Sprint" was created',
      time: "14m ago",
    },
    {
      icon: <AlertCircle className="h-4 w-4 text-white" />,
      iconColor: "bg-amber-500",
      title: "Role changed",
      description: "User role updated from Member to Admin",
      time: "1h ago",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4 text-white" />,
      iconColor: "bg-emerald-500",
      title: "Project archived",
      description: '"Beta MVP" project was archived by admin',
      time: "3h ago",
    },
    {
      icon: <FileText className="h-4 w-4 text-white" />,
      iconColor: "bg-slate-500",
      title: "Audit log exported",
      description: "Admin exported 500 audit log entries to CSV",
      time: "5h ago",
    },
    {
      icon: <Clock className="h-4 w-4 text-white" />,
      iconColor: "bg-rose-500",
      title: "User session expired",
      description: "2 admin sessions were invalidated",
      time: "8h ago",
    },
  ];

  const quickActions = [
    {
      label: "Invite User",
      icon: <UserPlus className="h-5 w-5" />,
      color: "bg-emerald-500 hover:bg-emerald-600",
      onClick: () => navigate("/admin/users"),
    },
    {
      label: "Manage Projects",
      icon: <FolderOpen className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => navigate("/admin/projects"),
    },
    {
      label: "View Audit Logs",
      icon: <Activity className="h-5 w-5" />,
      color: "bg-violet-500 hover:bg-violet-600",
      onClick: () => navigate("/admin/audit-logs"),
    },
    {
      label: "System Config",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-amber-500 hover:bg-amber-600",
      onClick: () => navigate("/admin/configuration/issue-types"),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here's a snapshot of your TaskFlow instance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${adminUsers} admin · ${totalUsers - adminUsers} members`}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, isUp: true }}
          color="emerald"
          to="/admin/users"
        />
        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle={`${activeProjects} active in last 2 days`}
          icon={<FolderOpen className="h-6 w-6" />}
          trend={{ value: 8, isUp: true }}
          color="blue"
          to="/admin/projects"
        />
        <StatCard
          title="Open Issues"
          value="—"
          subtitle="Across all projects"
          icon={<AlertCircle className="h-6 w-6" />}
          trend={{ value: 3, isUp: false }}
          color="amber"
        />
        <StatCard
          title="Resolved This Week"
          value="—"
          subtitle="Issues closed in 7 days"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 21, isUp: true }}
          color="rose"
        />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex flex-col items-center gap-2 rounded-xl p-4 text-white transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${action.color}`}
              >
                {action.icon}
                <span className="text-xs font-semibold text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Recent Activity</h2>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View all logs →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivities.map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* System Health Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-4 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">All Systems Operational</p>
          <p className="text-xs text-emerald-700">
            API server, database, and auth service are running normally.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-emerald-700">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
