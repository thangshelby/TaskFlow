import React from "react";
import { ArrowDown, ArrowUp, Edit, Trash2, Eye, Lock, Globe, Users } from "lucide-react";
import { IProject } from "@libs/types/project";

type SortField = "name" | "type" | "access" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

interface ProjectTableProps {
  projects: (IProject & { isInactive?: boolean })[];
  onEdit: (project: IProject) => void;
  onDelete: (projectId: string) => void;
  onViewDetail: (project: IProject) => void;
  sortConfig: { field: SortField; order: SortOrder };
  onSort: (field: SortField) => void;
}

const TypeBadge = ({ type }: { type: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      type === "Scrum"
        ? "bg-blue-100 text-blue-700"
        : "bg-teal-100 text-teal-700"
    }`}
  >
    {type}
  </span>
);

const AccessBadge = ({ access }: { access: string }) => {
  const config =
    access === "Private"
      ? {
          icon: <Lock className="h-3 w-3" />,
          className: "bg-slate-100 text-slate-600",
        }
      : access === "Public"
      ? {
          icon: <Globe className="h-3 w-3" />,
          className: "bg-emerald-100 text-emerald-700",
        }
      : {
          icon: <Users className="h-3 w-3" />,
          className: "bg-amber-100 text-amber-700",
        };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {access}
    </span>
  );
};

const ProjectKeyBadge = ({ keyStr }: { keyStr: string }) => (
  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-600">
    {keyStr}
  </span>
);

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

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
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
            <SortableHeader field="name">Project</SortableHeader>
            <SortableHeader field="type">Type</SortableHeader>
            <SortableHeader field="access">Access</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Members
            </th>
            <SortableHeader field="created_at">Created</SortableHeader>
            <SortableHeader field="updated_at">Last Active</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <p className="text-sm text-slate-500">No projects found</p>
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr
                key={project.id}
                className={`transition-colors duration-100 hover:bg-slate-50/60 ${
                  project.isInactive ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm">
                      <span className="text-xs font-bold text-white">
                        {project.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {project.name}
                      </p>
                      <ProjectKeyBadge keyStr={project.key} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <TypeBadge type={project.type} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <AccessBadge access={project.access} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="text-sm text-slate-600">
                    {project.members_count ?? project.project_members?.length ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-500">
                  {new Date(project.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        project.isInactive ? "bg-slate-300" : "bg-emerald-400"
                      }`}
                    />
                    <span className="text-sm text-slate-500">
                      {new Date(project.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetail(project)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      title="Edit project"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete project"
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

export default ProjectTable;
