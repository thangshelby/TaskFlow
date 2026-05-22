import React from "react";
import { Activity, Filter, Download, Search, Clock, User, FolderOpen, Settings, Shield } from "lucide-react";

type EventType = "USER" | "PROJECT" | "ADMIN" | "SECURITY";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  eventType: EventType;
  status: "SUCCESS" | "FAILED";
  ip: string;
}

const MOCK_LOGS: AuditEntry[] = [
  { id: "1", timestamp: "2026-05-21T12:01:00Z", actor: "admin@taskflow.io", action: "user.role_changed", target: "john.doe@example.com → Admin", eventType: "ADMIN", status: "SUCCESS", ip: "192.168.1.1" },
  { id: "2", timestamp: "2026-05-21T11:45:00Z", actor: "admin@taskflow.io", action: "user.deleted", target: "old.user@example.com", eventType: "USER", status: "SUCCESS", ip: "192.168.1.1" },
  { id: "3", timestamp: "2026-05-21T11:30:00Z", actor: "jane.smith@example.com", action: "user.login", target: "Admin portal", eventType: "SECURITY", status: "SUCCESS", ip: "10.0.0.5" },
  { id: "4", timestamp: "2026-05-21T10:55:00Z", actor: "unknown", action: "user.login_failed", target: "Admin portal", eventType: "SECURITY", status: "FAILED", ip: "203.0.113.5" },
  { id: "5", timestamp: "2026-05-21T10:20:00Z", actor: "admin@taskflow.io", action: "project.archived", target: "Beta MVP [BETA]", eventType: "PROJECT", status: "SUCCESS", ip: "192.168.1.1" },
  { id: "6", timestamp: "2026-05-21T09:45:00Z", actor: "admin@taskflow.io", action: "config.issue_type_created", target: "New Issue Type: Feature Request", eventType: "ADMIN", status: "SUCCESS", ip: "192.168.1.1" },
  { id: "7", timestamp: "2026-05-21T09:10:00Z", actor: "admin@taskflow.io", action: "user.created", target: "new.hire@example.com", eventType: "USER", status: "SUCCESS", ip: "192.168.1.1" },
  { id: "8", timestamp: "2026-05-20T17:30:00Z", actor: "admin@taskflow.io", action: "project.member_removed", target: "Alpha Sprint ← bob@example.com", eventType: "PROJECT", status: "SUCCESS", ip: "192.168.1.1" },
];

const eventTypeConfig: Record<EventType, { color: string; icon: React.ReactNode; bg: string }> = {
  USER: { color: "text-blue-600", bg: "bg-blue-50", icon: <User className="h-3.5 w-3.5" /> },
  PROJECT: { color: "text-emerald-600", bg: "bg-emerald-50", icon: <FolderOpen className="h-3.5 w-3.5" /> },
  ADMIN: { color: "text-violet-600", bg: "bg-violet-50", icon: <Settings className="h-3.5 w-3.5" /> },
  SECURITY: { color: "text-rose-600", bg: "bg-rose-50", icon: <Shield className="h-3.5 w-3.5" /> },
};

const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<EventType | "">("");

  const filtered = MOCK_LOGS.filter((log) => {
    const matchSearch =
      !search ||
      log.action.includes(search) ||
      log.actor.includes(search) ||
      log.target.includes(search);
    const matchType = !typeFilter || log.eventType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every admin action across the system.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
        <Activity className="h-4 w-4 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700">
          <strong>Phase 3 feature:</strong> These are mock entries. Full audit logging with before/after diffs will be implemented with a backend audit middleware in Phase 3.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none shadow-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as EventType | "")}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-emerald-400 focus:outline-none"
        >
          <option value="">All Events</option>
          <option value="USER">User Events</option>
          <option value="PROJECT">Project Events</option>
          <option value="ADMIN">Admin Events</option>
          <option value="SECURITY">Security Events</option>
        </select>
        <span className="ml-auto text-sm text-slate-400">{filtered.length} entries</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Timestamp</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Target</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filtered.map((log) => {
              const ec = eventTypeConfig[log.eventType];
              return (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{log.actor}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{log.action}</code>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-sm text-slate-600">{log.target}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${ec.bg} ${ec.color}`}>
                      {ec.icon}{log.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      log.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-400">{log.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsPage;
