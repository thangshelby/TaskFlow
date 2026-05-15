import { useState, useMemo } from "react";
import UserTable from "@libs/app/components/admin/users/UserTable";
import UserModal from "@libs/app/components/admin/users/UserModal";
import SearchFilters from "@libs/app/components/admin/common/SearchFilters";
import { useListUser } from "@libs/hooks/apis/useUser";
import { IUser } from "@libs/types/user";
import { useDebounce } from "@libs/hooks/common/useDebounce";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";

export type UserSortField = "name" | "email" | "role" | "created_at";
export type SortOrder = "asc" | "desc";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: UserSortField;
    order: SortOrder;
  }>({
    field: "name",
    order: "asc",
  });

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { users = [], isLoading } = useListUser(debouncedSearch);

  const sortedUsers = useMemo(() => {
    if (!users) return [];

    const getSortValue = (user: IUser, field: UserSortField) => {
      const sortValues = {
        name: `${user.first_name} ${user.last_name}`.toLowerCase(),
        email: user.email.toLowerCase(),
        role: user.role,
        created_at: new Date(user.created_at).getTime(),
      };
      return sortValues[field];
    };

    return [...users].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.field);
      const bValue = getSortValue(b, sortConfig.field);

      if (typeof aValue === "string") {
        return sortConfig.order === "asc"
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortConfig.order === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [users, sortConfig]);

  const handleSort = (field: UserSortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implement user deletion
    console.log("Delete user:", userId);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="space-y-6 p-6">
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onAddClick={() => setUserModalOpen(true)}
        addButtonText="Add User"
      />

      <div className="rounded-lg bg-white shadow">
        <UserTable
          users={sortedUsers}
          onEdit={(user) => {
            setEditingUser(user);
            setUserModalOpen(true);
          }}
          onDelete={handleDeleteUser}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>

      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={console.log}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UsersPage;
