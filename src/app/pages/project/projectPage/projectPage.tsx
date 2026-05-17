import Button from "@libs/app/components/general-components/button";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import {
  Search,
  Plus,
  Settings,
  User,
  ChevronDown,
  MoreHorizontal,
  Folder,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useUserProjects } from "@libs/hooks/apis/useProject";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "@libs/app/components/projects/modals/project/createProjectModal";
import { UI_COMMON_SIZES } from "@libs/app/components/general-components/constants/uiConfig";

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { projects } = useUserProjects();
  const [sortBy, setSortBy] = useState("newest");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  const activeProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() < new Date().getTime() &&
      new Date(p.due_date_to).getTime() > new Date().getTime(),
  ).length;

  const completedProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() > new Date().getTime() &&
      new Date(p.due_date_to).getTime() < new Date().getTime(),
  ).length;

  const upcomingProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() > new Date().getTime() &&
      new Date(p.due_date_to).getTime() > new Date().getTime(),
  ).length;

  const sortMenuItems: MenuProps["items"] = [
    { key: "newest", label: "Newest" },
    { key: "oldest", label: "Oldest" },
    { key: "name", label: "Name" },
  ];

  const projectActionItems: MenuProps["items"] = [
    { key: "view", label: "View Details" },
    { key: "edit", label: "Edit Project" },
    { key: "archive", label: "Archive" },
    {
      key: "delete",
      label: <span className="text-red-500">Delete Project</span>,
      danger: true,
    },
  ];

  return (
    <div className="h-full bg-[#fcfcfb]">
      <Helmet>
        <title>Projects - Task Flow</title>
      </Helmet>

      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-12">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="font-manrope text-4xl font-black tracking-tight text-[#064e3b]">
              Projects
            </h1>
            <p className="mt-2 font-manrope text-sm font-medium text-[#064e3b]/60 uppercase tracking-widest">
              Manage and track all your projects in one place
            </p>
          </div>

          {/* Controls */}
          <div className="mb-10 flex items-center gap-4">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b]/30 transition-colors group-focus-within:text-[#064e3b]" size={18} />
              <input
                placeholder="Search for projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 rounded-2xl border border-[#064e3b]/10 bg-white pl-12 pr-4 font-manrope text-sm transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-8 focus:ring-[#064e3b]/5 shadow-sm hover:shadow-md"
              />
            </div>

            <Dropdown
              menu={{
                items: sortMenuItems,
                onClick: ({ key }) => setSortBy(key),
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button className="flex h-11 w-24 items-center justify-center gap-2 rounded-xl bg-[#064e3b] font-manrope text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#064e3b]/20 transition-all hover:bg-[#064e3b]/90 hover:-translate-y-0.5 active:translate-y-0">
                <span className="pl-1">{sortBy}</span>
                <ChevronDown size={16} />
              </button>
            </Dropdown>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/summary`)}
                style={{
                  borderRadius: UI_COMMON_SIZES.medium.borderRadius,
                }}
                className="group relative flex cursor-pointer flex-col overflow-hidden border border-[#064e3b]/5 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#064e3b]/10"
              >
                {/* Project Banner Area */}
                <div className="relative h-32 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      background: project.background_img
                        ? `url(${project.background_img}) center/cover no-repeat`
                        : "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />

                  {/* Action Menu - Floating */}
                  <div className="absolute right-3 top-3 z-20">
                    <Dropdown menu={{ items: projectActionItems }} trigger={["click"]}>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all hover:bg-white hover:text-[#064e3b]"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </Dropdown>
                  </div>
                </div>

                {/* Project Content Area */}
                <div className="relative flex flex-col p-6 pt-0">
                  {/* Floating Icon Box */}
                  <div className="-mt-10 mb-5 relative z-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                      <div
                        className="h-full w-full rounded-xl flex items-center justify-center font-manrope text-2xl font-black text-white shadow-inner"
                        style={{
                          background: project.background_img
                            ? `url(${project.background_img}) center/cover no-repeat`
                            : "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
                        }}
                      >
                        {project.key}
                      </div>
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center rounded-full bg-[#064e3b]/5 px-2 py-0.5">
                      <span className="font-manrope text-[9px] font-black uppercase tracking-widest text-[#064e3b]/60">
                        {project.type}
                      </span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-[#064e3b]/20" />
                    <span className="font-manrope text-[10px] font-bold text-[#064e3b]/40">
                      {project.due_date_from ? new Date(project.due_date_from).toLocaleDateString() : "No due date"}
                    </span>
                  </div>

                  <h3 className="mb-2 font-manrope text-2xl font-black tracking-tight text-[#064e3b] transition-colors group-hover:text-emerald-700">
                    {project.name}
                  </h3>

                  <p className="mb-8 line-clamp-2 min-h-[2.5rem] font-manrope text-sm leading-relaxed text-[#064e3b]/60">
                    {project.description || "No description provided for this project."}
                  </p>

                  {/* Enhanced Progress Section */}
                  <div className="mb-8 rounded-2xl bg-[#fcfcfb] border border-[#064e3b]/5 p-4 shadow-inner-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                          Overall Progress
                        </span>
                      </div>
                      <span className="font-manrope text-sm font-black text-[#064e3b]">
                        {project.issues_count}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#064e3b]/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#064e3b] to-emerald-400 transition-all duration-1000 ease-out"
                        style={{ width: `${project.issues_count}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Stats - Cleaned up */}
                  <div className="flex items-center justify-between pt-5 border-t border-[#064e3b]/5">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2 group/stat">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064e3b]/5 text-[#064e3b]/40 transition-colors group-hover/stat:bg-[#064e3b] group-hover/stat:text-white">
                          <Folder size={14} />
                        </div>
                        <span className="font-manrope text-xs font-bold text-[#064e3b]/70">{project.issues_count}</span>
                      </div>
                      <div className="flex items-center gap-2 group/stat">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064e3b]/5 text-[#064e3b]/40 transition-colors group-hover/stat:bg-[#064e3b] group-hover/stat:text-white">
                          <User size={14} />
                        </div>
                        <span className="font-manrope text-xs font-bold text-[#064e3b]/70">{project.members_count}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-emerald-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="w-80 border-l border-[#064e3b]/5 bg-[#fcfcfb] p-8 overflow-y-auto">
          <div className="flex flex-col gap-10">
            {/* Project Statistics */}
            <div>
              <div className="mb-6 flex items-center gap-2 text-[#064e3b]">
                <TrendingUp size={18} />
                <h2 className="font-manrope text-[11px] font-black uppercase tracking-widest text-[#064e3b]/60">
                  Project Statistics
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#064e3b]/5 bg-white p-4 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">Total</div>
                  <div className="mt-1 text-2xl font-black text-[#064e3b]">{projects.length}</div>
                </div>
                <div className="rounded-xl border border-[#064e3b]/5 bg-white p-4 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Active</div>
                  <div className="mt-1 text-2xl font-black text-emerald-600">{activeProjects}</div>
                </div>
                <div className="rounded-xl border border-[#064e3b]/5 bg-white p-4 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Done</div>
                  <div className="mt-1 text-2xl font-black text-blue-600">{completedProjects}</div>
                </div>
                <div className="rounded-xl border border-[#064e3b]/5 bg-white p-4 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-500/60">Soon</div>
                  <div className="mt-1 text-2xl font-black text-orange-600">{upcomingProjects}</div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="mb-6 flex items-center gap-2 text-[#064e3b]">
                <Calendar size={18} />
                <h2 className="font-manrope text-[11px] font-black uppercase tracking-widest text-[#064e3b]/60">
                  Recent Projects
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {projects
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .slice(0, 3)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-center gap-3 rounded-xl border border-transparent bg-white p-3 shadow-sm transition-all hover:border-[#064e3b]/10"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: project.background_img ? "emerald" : "#064e3b",
                        }}
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate font-manrope text-xs font-bold text-[#064e3b]">
                          {project.name}
                        </div>
                        <div className="text-[10px] text-[#064e3b]/40">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <AlertTriangle size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="mb-6 font-manrope text-[11px] font-black uppercase tracking-widest text-[#064e3b]/60">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#064e3b]/10 bg-white px-4 py-3 font-manrope text-xs font-bold text-[#064e3b] transition-all hover:bg-[#064e3b] hover:text-white"
                >
                  <Plus size={16} />
                  Create New Project
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl border border-[#064e3b]/10 bg-white px-4 py-3 font-manrope text-xs font-bold text-[#064e3b] transition-all hover:bg-[#064e3b]/5">
                  <Folder size={16} />
                  View Archived
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl border border-[#064e3b]/10 bg-white px-4 py-3 font-manrope text-xs font-bold text-[#064e3b] transition-all hover:bg-[#064e3b]/5">
                  <Settings size={16} />
                  Project Settings
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={() => setIsCreateProjectModalOpen(false)} />
    </div>
  );
}
