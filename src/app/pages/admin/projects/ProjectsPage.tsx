import { useState, useEffect, lazy } from "react";
import ProjectTable from "@libs/app/components/admin/projects/ProjectTable";
import DeleteConfirmModal from "@libs/app/components/admin/common/DeleteConfirmModal";
import { IProject } from "@libs/types/project";
import { useListUser } from "@libs/hooks/apis/useUser";
import { useProjects } from "@libs/hooks/apis/useProject";
import { useDebounce } from "@libs/hooks/common/useDebounce";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";
import { Search, Plus, FolderOpen, Globe, Lock, RefreshCw } from "lucide-react";

const CreateProjectModal = lazy(
  () => import("@libs/app/components/projects/modals/project/createProjectModal")
);

export type ProjectSortField =
  | "name"
  | "type"
  | "access"
  | "created_at"
  | "updated_at";
export type SortOrder = "asc" | "desc";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectAccess, setProjectAccess] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<IProject | undefined>(
    undefined
  );
  const [sortConfig, setSortConfig] = useState<{
    field: ProjectSortField;
    order: SortOrder;
  }>({ field: "updated_at", order: "desc" });
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { users } = useListUser("a");
  const { projects, isLoading, error } = useProjects();

  useEffect(() => {
    let projectsList: IProject[] = [];
    if (projects && "data" in projects) {
      projectsList = Array.isArray(projects.data) ? projects.data : [];
    } else if (Array.isArray(projects)) {
      projectsList = projects;
    }

    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const filtered = projectsList
      .filter((project) => {
        const matchesSearch = project.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
        const matchesType = !projectType || project.type === projectType;
        const matchesAccess = !projectAccess || project.access === projectAccess;
        return matchesSearch && matchesType && matchesAccess;
      })
      .map((project) => ({
        ...project,
        isInactive: new Date(project.updated_at).getTime() < twoWeeksAgo,
      }))
      .sort((a, b) => {
        const getSortValue = (p: IProject): string | number => {
          const vals: Record<ProjectSortField, string | number> = {
            name: p.name.toLowerCase(),
            type: p.type.toLowerCase(),
            access: p.access.toLowerCase(),
            created_at: new Date(p.created_at).getTime(),
            updated_at: new Date(p.updated_at).getTime(),
          };
          return vals[sortConfig.field];
        };
        const av = getSortValue(a);
        const bv = getSortValue(b);
        if (typeof av === "string")
          return sortConfig.order === "asc"
            ? av.localeCompare(bv as string)
            : (bv as string).localeCompare(av);
        return sortConfig.order === "asc"
          ? (av as number) - (bv as number)
          : (bv as number) - (av as number);
      });

    setFilteredProjects(filtered);
  }, [projects, debouncedSearch, projectType, projectAccess, sortConfig]);

  const handleSort = (field: ProjectSortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteRequest = (projectId: string) => {
    setDeletingProjectId(projectId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProjectId) return;
    // TODO: wire up projects.delete API
    console.log("Delete project:", deletingProjectId);
    setDeleteModalOpen(false);
    setDeletingProjectId(null);
  };

  const allProjects: IProject[] = Array.isArray(projects?.data)
    ? projects.data
    : Array.isArray(projects)
    ? projects
    : [];
  const publicCount = allProjects.filter((p) => p.access === "Public").length;
  const privateCount = allProjects.filter((p) => p.access === "Private").length;

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Oversee all projects across the system, including private ones.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProject(undefined);
            setProjectModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{allProjects.length}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
            <FolderOpen className="h-3.5 w-3.5" /> Total Projects
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-700">{publicCount}</p>
          <p className="mt-0.5 text-xs font-medium text-emerald-500 flex items-center justify-center gap-1">
            <Globe className="h-3.5 w-3.5" /> Public
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-700">{privateCount}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
            <Lock className="h-3.5 w-3.5" /> Private
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
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all shadow-sm"
          />
        </div>

        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none shadow-sm"
        >
          <option value="">All Types</option>
          <option value="Scrum">Scrum</option>
          <option value="Kanban">Kanban</option>
        </select>

        <select
          value={projectAccess}
          onChange={(e) => setProjectAccess(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none shadow-sm"
        >
          <option value="">All Access</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="Teams">Teams</option>
        </select>

        <span className="text-sm text-slate-400 ml-auto">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
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
      <ProjectTable
        projects={filteredProjects}
        onEdit={(project) => {
          setEditingProject(project);
          setProjectModalOpen(true);
        }}
        onDelete={handleDeleteRequest}
        onViewDetail={(project) => {
          // TODO: open project detail drawer
          console.log("View project:", project.id);
        }}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Modals */}
      {projectModalOpen && (
        <CreateProjectModal
          isOpen={projectModalOpen}
          onClose={() => {
            setProjectModalOpen(false);
            setEditingProject(undefined);
          }}
          isEditing={!!editingProject}
          iniProject={editingProject}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingProjectId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description="This will permanently delete the project, all its issues, sprints, and member associations. This cannot be undone."
        confirmText="DELETE"
      />
    </div>
  );
};

export default ProjectsPage;
