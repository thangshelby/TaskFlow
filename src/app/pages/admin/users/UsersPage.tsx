import { useState, useMemo } from "react";
import UserTable from "@libs/app/components/admin/users/UserTable";
import UserModal from "@libs/app/components/admin/users/UserModal";
import UserDetailDrawer from "@libs/app/components/admin/users/UserDetailDrawer";
import DeleteConfirmModal from "@libs/app/components/admin/common/DeleteConfirmModal";
import { useAdminListUsers, useUpdateUser, useAdminDeleteUser } from "@libs/hooks/apis/useUser";
import { IUser } from "@libs/types/user";
import { UserFormData } from "@libs/app/components/admin/users/UserModal";
import { useDebounce } from "@libs/hooks/common/useDebounce";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";
import { Search, Plus, Users, Shield, RefreshCw } from "lucide-react";

export type UserSortField = "name" | "email" | "role" | "created_at";
export type SortOrder = "asc" | "desc";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "Admin" | "User">("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: UserSortField;
    order: SortOrder;
  }>({ field: "name", order: "asc" });

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { users = [], isLoading, error } = useAdminListUsers(debouncedSearch);
  const updateUser = useUpdateUser();
  const deleteUser = useAdminDeleteUser();

  const filteredSortedUsers = useMemo(() => {
    let list = [...(users ?? [])];

    // Filter by search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (u) =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // Filter by role
    if (roleFilter) {
      list = list.filter((u) => u.role === roleFilter);
    }

    // Sort
    list.sort((a, b) => {
      const getValue = (u: IUser) => {
        if (sortConfig.field === "name")
          return `${u.first_name} ${u.last_name}`.toLowerCase();
        if (sortConfig.field === "created_at")
          return new Date(u.created_at).getTime();
        return (u[sortConfig.field] as string).toLowerCase();
      };
      const av = getValue(a);
      const bv = getValue(b);
      if (typeof av === "string")
        return sortConfig.order === "asc"
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortConfig.order === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });

    return list;
  }, [users, debouncedSearch, roleFilter, sortConfig]);

  const handleSort = (field: UserSortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleUserSubmit = async (data: UserFormData) => {
    if (editingUser) {
      await updateUser.mutateAsync({ user_id: editingUser.id, ...data });
    }
    // TODO: wire up create user API when backend endpoint is available
    setUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteRequest = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUserId) return;
    await deleteUser.mutateAsync(deletingUserId);
    setDeleteModalOpen(false);
    setDeletingUserId(null);
  };

  const openEditModal = (user: IUser) => {
    setEditingUser(user);
    setDetailOpen(false);
    setUserModalOpen(true);
  };

  const openDetailDrawer = (user: IUser) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const totalAdmins = users?.filter((u) => u.role === "Admin").length ?? 0;
  const totalMembers = users?.filter((u) => u.role === "User").length ?? 0;

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all users, roles, and access in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setUserModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{users?.length ?? 0}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
            <Users className="h-3.5 w-3.5" /> Total Users
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-violet-700">{totalAdmins}</p>
          <p className="mt-0.5 text-xs font-medium text-violet-500 flex items-center justify-center gap-1">
            <Shield className="h-3.5 w-3.5" /> Admins
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-700">{totalMembers}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
            <Users className="h-3.5 w-3.5" /> Members
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all shadow-sm"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "" | "Admin" | "User")}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">Member</option>
        </select>

        {/* Result count */}
        <span className="text-sm text-slate-400 ml-auto">
          {filteredSortedUsers.length} user{filteredSortedUsers.length !== 1 ? "s" : ""}
        </span>

        {error && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        )}
      </div>

      {/* Table */}
      <UserTable
        users={filteredSortedUsers}
        onEdit={openEditModal}
        onDelete={handleDeleteRequest}
        onViewDetail={openDetailDrawer}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Modals & Drawers */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        editingUser={editingUser}
        isLoading={updateUser.isPending}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingUserId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        description="This will permanently remove the user and cannot be undone. All their data will remain but be attributed to a deleted account."
        confirmText="DELETE"
      />

      <UserDetailDrawer
        user={selectedUser}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={openEditModal}
      />
    </div>
  );
};

export default UsersPage;
