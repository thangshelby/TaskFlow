import { useState } from "react";
import AdminHeader from "@libs/app/components/admin/common/AdminHeader";
import AdminSidebar from "@libs/app/components/admin/common/AdminSidebar";
import SearchFilters from "@libs/app/components/admin/common/SearchFilters";
import UserTable from "@libs/app/components/admin/users/UserTable";
import UserModal from "@libs/app/components/admin/users/UserModal";
import ProjectTable from "@libs/app/components/admin/projects/ProjectTable";
import CreateProjectModal from "@libs/app/components/projects/modals/project/createProjectModal";
import { useListUser } from "@libs/hooks/apis/useUser";
import { useProjects } from "@libs/hooks/apis/useProject";
import { IUser } from "@libs/types/user";
import { IProject } from "@libs/types/project";
import { UserFormData } from "@libs/app/components/admin/users/UserModal";

type ProjectSortField =
  | "name"
  | "type"
  | "access"
  | "created_at"
  | "updated_at";
type UserSortField = "name" | "email" | "role" | "created_at";
type SortOrder = "asc" | "desc";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "projects">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectAccess, setProjectAccess] = useState("");

  const [projectSortConfig, setProjectSortConfig] = useState<{
    field: ProjectSortField;
    order: SortOrder;
  }>({
    field: "updated_at",
    order: "desc",
  });

  const [userSortConfig, setUserSortConfig] = useState<{
    field: UserSortField;
    order: SortOrder;
  }>({
    field: "name",
    order: "asc",
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [editingProject, setEditingProject] = useState<IProject | undefined>(
    undefined,
  );

  const { users } = useListUser("");
  const { projects = [] } = useProjects();

  const handleProjectSort = (field: ProjectSortField) => {
    setProjectSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleUserSort = (field: UserSortField) => {
    setUserSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleUserSubmit = (data: UserFormData) => {
    console.log("User data:", data);
    setUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Delete user:", userId);
  };

  const handleDeleteProject = (projectId: string) => {
    console.log("Delete project:", projectId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={
            activeTab === "users" ? "Users Management" : "Projects Management"
          }
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddClick={() => {
                if (activeTab === "users") {
                  setUserModalOpen(true);
                } else {
                  setProjectModalOpen(true);
                }
              }}
              addButtonText={activeTab === "users" ? "Add User" : "Add Project"}
              showProjectFilters={activeTab === "projects"}
              projectType={projectType}
              projectAccess={projectAccess}
              onProjectTypeChange={setProjectType}
              onProjectAccessChange={setProjectAccess}
            />

            <div className="rounded-lg bg-white shadow">
              {activeTab === "users" ? (
                <UserTable
                  users={users || []}
                  onEdit={(user) => {
                    setEditingUser(user);
                    setUserModalOpen(true);
                  }}
                  onDelete={handleDeleteUser}
                  sortConfig={userSortConfig}
                  onSort={handleUserSort}
                />
              ) : (
                <ProjectTable
                  projects={projects}
                  users={users || []}
                  onEdit={(project) => {
                    setEditingProject(project);
                    setProjectModalOpen(true);
                  }}
                  onDelete={handleDeleteProject}
                  sortConfig={projectSortConfig}
                  onSort={handleProjectSort}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        editingUser={editingUser}
      />

      <CreateProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(undefined);
        }}
        isEditing={!!editingProject}
        iniProject={editingProject}
      />
    </div>
  );
};

export default AdminDashboard;
