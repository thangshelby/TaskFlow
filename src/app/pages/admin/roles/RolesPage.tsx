import React from "react";
import { Shield, Lock, Users, CheckCheck } from "lucide-react";

const ROLES = [
  {
    name: "Super Admin",
    color: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    description: "Full system access. Cannot be deleted or demoted.",
    users: 1,
    permissions: ["All permissions"],
  },
  {
    name: "Admin",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    description: "Manage users, projects, and system configuration.",
    users: 3,
    permissions: ["user:manage", "project:manage", "config:manage"],
  },
  {
    name: "Member",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    description: "Default role. Can create and manage their own projects.",
    users: 48,
    permissions: ["project:create", "issue:manage", "comment:manage"],
  },
  {
    name: "Guest",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    description: "Read-only access to shared projects.",
    users: 7,
    permissions: ["project:read", "issue:read"],
  },
];

const PERMISSIONS_MATRIX = [
  { group: "Users", items: ["user:read", "user:create", "user:update", "user:delete"] },
  { group: "Projects", items: ["project:read", "project:create", "project:update", "project:delete"] },
  { group: "Issues", items: ["issue:read", "issue:create", "issue:update", "issue:delete"] },
  { group: "Config", items: ["config:read", "config:manage"] },
];

const RolesPage: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define what each role can do across the system.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
          <Lock className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium text-amber-700">
            Custom roles available in Phase 2
          </span>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role) => (
          <div
            key={role.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${role.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${role.dot}`} />
                {role.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" />
                {role.users}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">{role.description}</p>
            <div className="space-y-1.5">
              {role.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="font-mono text-xs text-slate-600">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix (preview) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-semibold text-slate-800">Permission Matrix</h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            Phase 2 — Editable
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Permission
                </th>
                {ROLES.map((r) => (
                  <th key={r.name} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {PERMISSIONS_MATRIX.map((group) => (
                <React.Fragment key={group.group}>
                  <tr className="bg-slate-50/40">
                    <td colSpan={5} className="px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {group.group}
                      </span>
                    </td>
                  </tr>
                  {group.items.map((perm) => (
                    <tr key={perm} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5">
                        <code className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {perm}
                        </code>
                      </td>
                      {ROLES.map((role) => {
                        const hasIt =
                          role.permissions.includes("All permissions") ||
                          role.permissions.includes(perm) ||
                          (role.name === "Admin" && !perm.includes("delete") && !perm.startsWith("config"));
                        return (
                          <td key={role.name} className="px-4 py-2.5 text-center">
                            {hasIt ? (
                              <span className="inline-block h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-200 text-lg">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phase 2 CTA */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
        <Shield className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-600">Custom Roles — Phase 2</p>
        <p className="text-xs text-slate-400 mt-1">
          Create custom roles with fine-grained permissions tailored to your organization.
        </p>
      </div>
    </div>
  );
};

export default RolesPage;
