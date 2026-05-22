import React from "react";
import { ArrowDown, ArrowUp, Edit, Trash2, Shield, User, Eye, MoreHorizontal } from "lucide-react";
import { IUser } from "@libs/types/user";

type SortField = "name" | "email" | "role" | "created_at";
type SortOrder = "asc" | "desc";

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (userId: string) => void;
  onViewDetail: (user: IUser) => void;
  sortConfig: { field: SortField; order: SortOrder };
  onSort: (field: SortField) => void;
}

const SortIcon = ({
  field,
  sortConfig,
}: {
  field: SortField;
  sortConfig: { field: SortField; order: SortOrder };
}) => {
  if (sortConfig.field !== field)
    return <span className="ml-1 text-slate-300">↕</span>;
  return sortConfig.order === "asc" ? (
    <ArrowUp className="ml-1 inline h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="ml-1 inline h-3.5 w-3.5" />
  );
};

const RoleBadge = ({ role }: { role: string }) => {
  if (role === "Admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
        <Shield className="h-3 w-3" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      <User className="h-3 w-3" />
      Member
    </span>
  );
};

const AvatarCell = ({ user }: { user: IUser }) => {
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex items-center gap-3">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={initials}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white shadow-sm ring-2 ring-white">
          {initials || "?"}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-xs text-slate-400">{user.id.slice(0, 8)}...</p>
      </div>
    </div>
  );
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onViewDetail,
  sortConfig,
  onSort,
}) => {
  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 select-none transition-colors"
    >
      {children}
      <SortIcon field={field} sortConfig={sortConfig} />
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/80">
          <tr>
            <SortableHeader field="name">User</SortableHeader>
            <SortableHeader field="email">Email</SortableHeader>
            <SortableHeader field="role">Role</SortableHeader>
            <SortableHeader field="created_at">Joined</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <User className="h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-500">No users found</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/60 transition-colors duration-100"
              >
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <AvatarCell user={user} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="text-sm text-slate-700">{user.email}</span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetail(user)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      title="Edit user"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
