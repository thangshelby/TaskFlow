import { useState, useEffect } from "react";
import ProjectTable from "@libs/app/components/admin/projects/ProjectTable";
import CreateProjectModal from "@libs/app/components/projects/modals/project/createProjectModal";
import SearchFilters from "@libs/app/components/admin/common/SearchFilters";
import { IProject } from "@libs/types/project";
import { useListUser } from "@libs/hooks/apis/useUser";
import { useProjects } from "@libs/hooks/apis/useProject";
import { useDebounce } from "@libs/hooks/common/useDebounce";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";

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
  const [editingProject, setEditingProject] = useState<IProject | undefined>(
    undefined,
  );
  const [sortConfig, setSortConfig] = useState<{
    field: ProjectSortField;
    order: SortOrder;
  }>({
    field: "updated_at",
    order: "desc",
  });
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { users } = useListUser("");
  const { projects, isLoading } = useProjects();

  useEffect(() => {
    let projectsList: IProject[] = [];

    if (projects && "data" in projects) {
      projectsList = Array.isArray(projects.data) ? projects.data : [];
    }

    const currentTime = new Date().getTime();
    const twoWeeksAgo = currentTime - 14 * 24 * 60 * 60 * 1000;

    const filtered = projectsList
      .filter((project) => {
        const matchesSearch = project.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
        const matchesType = !projectType || project.type === projectType;
        const matchesAccess =
          !projectAccess || project.access === projectAccess;
        return matchesSearch && matchesType && matchesAccess;
      })
      .map((project) => ({
        ...project,
        isInactive: new Date(project.updated_at).getTime() < twoWeeksAgo,
      }))
      .sort((a, b) => {
        const aValue = getSortValue(a);
        const bValue = getSortValue(b);

        if (typeof aValue === "string") {
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue);
        }

        return sortConfig.order === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });

    setFilteredProjects(filtered);
  }, [projects, debouncedSearch, projectType, projectAccess, sortConfig]);
  const getSortValue = (project: IProject) => {
    const sortValues: Record<ProjectSortField, string | number> = {
      name: project.name.toLowerCase(),
      type: project.type.toLowerCase(),
      access: project.access.toLowerCase(),
      created_at: new Date(project.created_at).getTime(),
      updated_at: new Date(project.updated_at).getTime(),
    };
    return sortValues[sortConfig.field];
  };

  const handleSort = (field: ProjectSortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDeleteProject = async (projectId: string) => {
    // TODO: Implement project deletion
    console.log("Delete project:", projectId);
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="space-y-6 p-6">
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setProjectModalOpen(true)}
        addButtonText="Add Project"
        showProjectFilters
        projectType={projectType}
        projectAccess={projectAccess}
        onProjectTypeChange={setProjectType}
        onProjectAccessChange={setProjectAccess}
      />

      <div className="rounded-lg bg-white shadow">
        <ProjectTable
          projects={filteredProjects}
          users={users || []}
          onEdit={(project) => {
            setEditingProject(project);
            setProjectModalOpen(true);
          }}
          onDelete={handleDeleteProject}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>

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

export default ProjectsPage;
