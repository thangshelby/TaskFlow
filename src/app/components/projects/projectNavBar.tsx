import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Package,
  Layers,
  Archive,
  Settings,
  HelpCircle,
  LogOut,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { useProjectByID } from "../../../hooks/apis/useProject";
import AddProjectMemberModal from "./modals/project/addProjectMemberModal";
import { useIssueStore } from "@libs/store/useIssueStore";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import PermissionButton from "@libs/app/components/general-components/pemissionButton";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  route: string;
}

interface SortableNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

const SortableNavItem: React.FC<SortableNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "default",
    touchAction: "none",
  };
  const { closeIssueDetail } = useIssueStore();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full ${isDragging ? "z-50 opacity-50" : "z-0"}`}
      {...attributes}
      {...listeners}
      aria-label={`Reorder ${item.label}`}
    >
      <Link
        to={item.route}
        onClick={() => {
          closeIssueDetail();
        }}
        aria-label={item.label}
        className={`group relative flex w-full items-center ${isCollapsed ? "justify-center px-0" : "justify-start px-4"
          } py-2.5 text-xs font-semibold uppercase tracking-widest no-underline transition-all duration-200 rounded-md ${isActive
            ? "bg-white text-[#064e3b] shadow-sm"
            : "text-[#404944] hover:bg-[#eeeeed] hover:text-[#064e3b]"
          }`}
      >
        <span
          className={`${isCollapsed ? "mr-0" : "mr-3"
            } transition-colors ${isActive
              ? "text-[#064e3b]"
              : "text-[#404944] group-hover:text-[#064e3b]"
            }`}
        >
          {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
        </span>
        {!isCollapsed && (
          <span className="whitespace-nowrap font-inter">{item.label}</span>
        )}
      </Link>
    </div>
  );
};

interface ProjectNavbarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const ProjectNavbar: React.FC<ProjectNavbarProps> = ({
  isCollapsed = false,
  onToggle,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  useEffect(() => {
    setIsAddMemberModalOpen(false);
  }, [location.pathname]);

  const { project } = useProjectByID(projectId || "");

  const getNavItems = (currentProjectId: string): NavItem[] => [
    {
      id: "summary",
      label: "Summary",
      icon: <LayoutDashboard />,
      route: `/projects/${currentProjectId}/summary`,
    },
    {
      id: "board",
      label: "Board",
      icon: <Zap />,
      route: `/projects/${currentProjectId}/board`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: <Layers />,
      route: `/projects/${currentProjectId}/backlog`,
    },
    {
      id: "list",
      label: "List",
      icon: <Package />,
      route: `/projects/${currentProjectId}/list`,
    },
    {
      id: "roadmap",
      label: "Roadmap",
      icon: <Archive />,
      route: `/projects/${currentProjectId}/roadmap`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings />,
      route: `/projects/${currentProjectId}/settings`,
    },
  ];

  const defaultItems = getNavItems(projectId || "");

  const [items, setItems] = useState<NavItem[]>(() => {
    const savedOrder = localStorage.getItem(`navbar-order-${projectId}`);
    if (savedOrder) {
      const orderIds: string[] = JSON.parse(savedOrder);
      return orderIds
        .map((id: string) =>
          getNavItems(projectId || "").find((item) => item.id === id),
        )
        .filter(Boolean) as NavItem[];
    }
    return defaultItems;
  });

  useEffect(() => {
    if (projectId) {
      const savedOrder = localStorage.getItem(`navbar-order-${projectId}`);
      if (savedOrder) {
        const orderIds: string[] = JSON.parse(savedOrder);
        setItems(
          orderIds
            .map((id: string) =>
              getNavItems(projectId).find((item) => item.id === id),
            )
            .filter(Boolean) as NavItem[],
        );
      } else {
        setItems(getNavItems(projectId));
      }
    }
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const newItems = arrayMove(
          items,
          items.findIndex((item) => item.id === active.id),
          items.findIndex((item) => item.id === over.id),
        );
        localStorage.setItem(
          `navbar-order-${projectId}`,
          JSON.stringify(newItems.map((item) => item.id)),
        );
        return newItems;
      });
    }
  };

  return (
    <div className={`relative flex h-full flex-col bg-[#f3f4f3] ${isCollapsed ? "px-2" : "px-3"} py-4 gap-y-2 border-r border-[#e8e8e7] transition-all duration-300 ease-in-out`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[50%] z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#e8e8e7] bg-white text-[#404944] shadow-md hover:text-[#064e3b] hover:scale-110 transition-all duration-200 group/collapse"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="transition-transform group-hover/collapse:translate-x-0.5" />
        ) : (
          <ChevronLeft size={14} className="transition-transform group-hover/collapse:-translate-x-0.5" />
        )}
      </button>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Project Header */}
        <div className={`py-6 ${isCollapsed ? "mb-2" : "mb-4"} transition-all duration-300`}>
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            {/* Project Info */}
            <div
              className={`flex items-center min-w-0 ${isCollapsed ? "w-full justify-center" : "flex-1 gap-4"}`}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm hover:rotate-3 transition-transform duration-300 overflow-hidden"
                style={{
                  background: project?.background_img
                    ? `url(${project.background_img}) center/cover no-repeat`
                    : "#064e3b",
                }}
              >
                {!project?.background_img && <Compass size={20} strokeWidth={2.5} />}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 overflow-hidden animate-slide-in-left">
                  <h2 className="text-sm font-bold text-[#064e3b] uppercase tracking-widest truncate leading-tight">
                    {project?.name || "Project Workspace"}
                  </h2>
                  <p className="text-[10px] text-[#404944] font-medium opacity-70 truncate">
                    {project?.key || "PROJ"} • Engineering Alpha
                  </p>
                </div>
              )}
            </div>

            {/* Invite Members Button - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="shrink-0 animate-scale-in">
                <PermissionButton
                  title="Invite Members to Project"
                  action={PERMISSIONS_CONFIG.projectMember.add}
                  handleClick={() => setIsAddMemberModalOpen(true)}
                >
                  <div className="flex cursor-pointer items-center justify-center text-[#404944] hover:text-[#064e3b] transition-colors p-2 hover:bg-[#eeeeed] rounded-lg">
                    <UserPlus size={18} />
                  </div>
                </PermissionButton>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide`}>
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={closestCenter}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.route}
                  isCollapsed={isCollapsed}
                />
              ))}
            </SortableContext>
          </DndContext>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className={`mt-auto pt-4 space-y-1 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        {!isCollapsed ? (
          <button className="w-full mb-4 py-2.5 px-4 bg-[#064e3b] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md hover:bg-[#085a44] active:scale-95 transition-all duration-200 animate-slide-in-left">
            Sync Data
          </button>
        ) : (
          <button
            className="mb-4 p-2.5 bg-[#064e3b] text-white rounded-lg shadow-md hover:bg-[#085a44] active:scale-95 transition-all duration-200 group/sync"
            title="Sync Data"
            aria-label="Sync Data"
          >
            <Zap size={18} className="group-hover/sync:animate-pulse" />
          </button>
        )}

        <Link
          to="#"
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 text-[#404944] hover:bg-[#eeeeed] hover:text-[#064e3b] rounded-md transition-all duration-200 group/nav`}
          title={isCollapsed ? "Support" : ""}
          aria-label="Support"
        >
          <HelpCircle size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-inter text-xs font-semibold uppercase tracking-widest whitespace-nowrap animate-slide-in-left transition-all duration-300">Support</span>}
        </Link>

        <Link
          to="/logout"
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 text-[#404944] hover:bg-[#eeeeed] hover:text-[#064e3b] rounded-md transition-all duration-200 group/nav`}
          title={isCollapsed ? "Sign Out" : ""}
          aria-label="Sign Out"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-inter text-xs font-semibold uppercase tracking-widest whitespace-nowrap animate-slide-in-left transition-all duration-300">Sign Out</span>}
        </Link>
      </div>

      <AddProjectMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={projectId || ""}
      />
    </div>
  );
};

export default ProjectNavbar;
