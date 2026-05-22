import React from "react";
import { X, User, Mail, Shield, Calendar, Clock, Copy, CheckCheck } from "lucide-react";
import { IUser } from "@libs/types/user";

interface UserDetailDrawerProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: IUser) => void;
}

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    {icon && (
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="mt-0.5 text-sm text-slate-800 break-all">{value}</div>
    </div>
  </div>
);

const CopyableId = ({ id }: { id: string }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-emerald-600 transition-colors group"
    >
      <span className="truncate max-w-[180px]">{id}</span>
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-400 shrink-0" />
      )}
    </button>
  );
};

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !user) return null;

  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">User Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile section */}
          <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-slate-50 to-white px-6 py-8 border-b border-slate-100">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={initials}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white shadow-md ring-4 ring-white">
                {initials || "?"}
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                {user.first_name} {user.last_name}
              </h3>
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.role === "Admin"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {user.role === "Admin" ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {user.role}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-4">
            <InfoRow
              label="User ID"
              value={<CopyableId id={user.id} />}
            />
            <InfoRow
              label="Email"
              icon={<Mail className="h-4 w-4" />}
              value={user.email}
            />
            <InfoRow
              label="Role"
              icon={<Shield className="h-4 w-4" />}
              value={user.role}
            />
            <InfoRow
              label="Joined"
              icon={<Calendar className="h-4 w-4" />}
              value={new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <InfoRow
              label="Last Updated"
              icon={<Clock className="h-4 w-4" />}
              value={new Date(user.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={() => onEdit(user)}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Edit User
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDetailDrawer;
