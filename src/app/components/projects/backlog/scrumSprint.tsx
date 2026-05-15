import { useState, memo, useTransition, lazy } from "react";
import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import Button from "@libs/app/components/general-components/button";
import { formatSprintDate } from "../../../../utils/date";
import { FaChevronDown } from "react-icons/fa";
import { ISprint } from "@libs/types/sprint";
import IssueCard from "./issueCard";
import { MenuProps, Dropdown, Tooltip } from "antd";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import ConfirmDeleteModal from "@libs/app/components/general-components/modal/modalDeleteConfirm";
import CreateIssueModal from "@libs/app/components/projects/modals/issue/createIssueModal";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDeleteSprint } from "@libs/hooks/apis/useSprint";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useDroppable } from "@dnd-kit/core";
import { useOverItem } from "@libs/app/context/backlog.context";

const CompleteSprintModal = lazy(
  () =>
    import("@libs/app/components/projects/modals/sprint/completeSprintModal"),
);
interface ISprintIssues extends ISprint {
  issues: IIssue[];
}
import React from "react";

interface DroppableWrapperProps {
  id: string;
  data?: Record<string, any>;
  children: React.ReactNode;
}

const DroppableWrapper = React.memo(
  ({ id, data, children }: DroppableWrapperProps) => {
    const { setNodeRef } = useDroppable({
      id,
      data,
    });

    return <div ref={setNodeRef}>{children}</div>;
  },
);
interface ScrumSprintProps {
  sprint: ISprintIssues;
  projectId: string;
  isDragging: boolean;
  setIsCreateSprintModalOpen: (data: {
    isOpen: boolean;
    sprint?: ISprint | null | ISprintIssues;
  }) => void;
}

const ScrumSprint = memo(
  ({
    sprint,
    projectId,
    isDragging,
    setIsCreateSprintModalOpen,
  }: ScrumSprintProps) => {
    const { overItemId } = useOverItem();
    const [, startTransition] = useTransition();
    const { deleteSprint } = useDeleteSprint({
      projectId,
      onClose: () => {
        setIsDeleteSprintModalOpen(false);
      },
    });
    const { updateIssueAsync } = useUpdateIssue({
      projectId,
    });

    const [isOpenButtonMenu, setIsOpenButtonMenu] = useState(false);
    const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] =
      useState(false);
    const [isDeleteSprintModalOpen, setIsDeleteSprintModalOpen] =
      useState(false);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);

    const [isExpanded, setIsExpanded] = useState(true);
    const { columns } = useProjectColumns({ project_id: projectId });

    const buttonItems: MenuProps["items"] = [
      {
        label: "Edit Sprint",
        key: "edit-sprint",
        onClick: () =>
          startTransition(() => {
            console.log(sprint);
            setIsCreateSprintModalOpen({
              isOpen: true,
              sprint: sprint,
            });
          }),
      },
      {
        label: "Delete Sprint",
        key: "delete-sprint",
        onClick: () => setIsDeleteSprintModalOpen(true),
      },
    ];

    const handleDeleteSprint = async () => {
      try {
        for (const issue of sprint.issues) {
          await updateIssueAsync({
            id: issue.id,
            data: {
              sprint_id: undefined,
            },
          });
        }
        // Delete the sprint after all issues are updated
        deleteSprint(sprint?.id);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <DroppableWrapper id={sprint.id} data={{ type: "Sprint", sprint }}>
        <div className="flex w-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border border-[#064e3b]/5 bg-white shadow-sm ring-1 ring-black/5">
            {/* Header */}
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-[#fcfcfb]/80 border-b border-[#064e3b]/5 px-4 py-2 cursor-pointer group/header"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    title="Expand/Collapse Sprint"
                    className={`flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm border border-[#064e3b]/5 text-[#064e3b]/40 transition-all group-hover/header:text-[#064e3b] group-hover/header:border-[#064e3b]/20 active:scale-90 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    <FaChevronDown size={8} />
                  </button>

                  <div className="flex items-center gap-3 min-w-0">
                    <h2 className="text-[12px] font-black text-[#064e3b] font-manrope uppercase tracking-tight truncate">
                      {sprint?.name}
                    </h2>
                    {sprint?.name !== "Backlog" && (
                      <span className="text-[10px] font-bold text-[#064e3b] font-manrope whitespace-nowrap">
                        {formatSprintDate(sprint?.date_started)} — {formatSprintDate(sprint?.date_ended)}
                      </span>
                    )}
                    <span className="text-[10px] font-black text-[#064e3b] py-0.5 px-1.5 bg-[#064e3b]/15 rounded-md font-manrope uppercase min-w-0 truncate tracking-wider">
                      {sprint.issues.length} {sprint.issues.length === 1 ? "Issue" : "Issues"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* metadata counters */}
                  <div className="hidden md:flex items-center gap-1.5 opacity-40 group-hover/header:opacity-100 transition-opacity">
                    {columns?.map((column) => {
                      const count = sprint.issues.filter(
                        (issue) => issue?.column?.id === column.id,
                      ).length;
                      if (count === 0) return null;


                      return (
                        <Tooltip
                          key={column.id}
                          title={
                            <div className="flex flex-col py-0.5 px-1 font-manrope">
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                {column.name}
                              </span>
                              <span className="text-[11px] font-black">
                                {count} {count === 1 ? "Item" : "Items"}
                              </span>
                            </div>
                          }
                        >
                          <div
                            className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#064e3b]/20 px-1.5 text-[9px] font-black text-[#064e3b] font-manrope"
                          >
                            {count}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={sprint.name === "Backlog" ? "light" : "primary"}
                      size="sm"
                      className="h-6 px-2! text-sm"
                      onClick={(e) => {
                        e?.stopPropagation()
                        if (sprint.name === "Backlog") {
                          setIsCreateSprintModalOpen({ isOpen: true, sprint: null });
                        } else if (new Date(sprint.date_started).getTime() < new Date().getTime()) {
                          setIsCompleteSprintModalOpen(true);
                        } else {
                          setIsCreateSprintModalOpen({ isOpen: true, sprint: sprint });
                        }
                      }}
                    >
                      {sprint.name === "Backlog"
                        ? "Create Sprint"
                        : (new Date(sprint.date_started).getTime() < new Date().getTime() ? "Complete" : "Start")}
                    </Button>

                    <Dropdown
                      menu={{ items: buttonItems }}
                      trigger={["click"]}
                      onOpenChange={setIsOpenButtonMenu}
                      open={isOpenButtonMenu}
                    >
                      <button
                        aria-label="More sprint options"
                        className={`flex h-8 w-8 items-center justify-center rounded-md transition-all hover:bg-[#064e3b]/5 text-[#064e3b]/60 hover:text-[#064e3b] ${isOpenButtonMenu ? "bg-[#064e3b]/10 text-[#064e3b]" : ""}`}
                        onClick={(e) => {
                          e?.stopPropagation()
                        }}
                      >
                        <BsThreeDots size={16} />
                      </button>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            {isExpanded && (
              <div className={`p-2 transition-colors duration-300 ${overItemId === sprint.id ? "bg-[#d1fae5]" : "bg-white"}`}>
                <SortableContext
                  strategy={horizontalListSortingStrategy}
                  items={sprint.issues.map((issue) => issue.id)}
                >
                  <div className="flex flex-col">
                    {sprint.issues.length > 0 ? (
                      sprint.issues.map((issue) => (
                        <div key={issue.id} className="group relative">
                          <IssueCard issue={issue} projectId={projectId} />
                          <div
                            style={{ opacity: isDragging && issue.id === overItemId ? 1 : 0 }}
                            className="absolute -top-[2px] left-0 z-50 w-full h-[3px] bg-[#064e3b] transition-opacity pointer-events-none rounded-full shadow-[0_0_8px_rgba(6,78,59,0.3)]"
                          />
                        </div>
                      ))
                    ) : (
                      <div className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed transition-all duration-300 ${overItemId === sprint.id ? "border-[#064e3b] bg-[#d1fae5]" : "border-[#10b981]/20 bg-[#f9f9f8]/50"}`}>
                        <p className="text-[11px] font-black text-[#064e3b] font-manrope uppercase tracking-widest opacity-80">
                          Drop issues here to plan your sprint
                        </p>
                      </div>
                    )}
                  </div>
                </SortableContext>

                <button
                  onClick={() => setIsCreateIssueModalOpen(true)}
                  className="mt-2 cursor-pointer flex w-full items-center gap-3 rounded-md border border-transparent py-2.5 px-4 text-[#064e3b]/80 transition-all hover:bg-[#064e3b]/5 hover:text-[#064e3b] active:scale-[0.99] group"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#064e3b]/10 text-[#064e3b] group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                    <FaPlus size={10} />
                  </div>
                  <span className="text-[12px] font-bold font-manrope uppercase tracking-tight">Create Issue</span>
                </button>
              </div>
            )}

            <ConfirmDeleteModal
              title={`Delete Sprint ${sprint?.name}`}
              description={`Are you sure you want to delete "${sprint?.name}"?`}
              open={isDeleteSprintModalOpen}
              onClose={() => setIsDeleteSprintModalOpen(false)}
              onConfirm={handleDeleteSprint}
            />

            <CreateIssueModal
              isOpen={isCreateIssueModalOpen}
              onClose={() => setIsCreateIssueModalOpen(false)}
              projectId={projectId}
            />
          </div>

          {!isExpanded && (
            <div className="flex justify-end px-4">
              <span className="text-[10px] font-black text-[#064e3b]/80 font-manrope uppercase tracking-widest">
                {sprint.issues.length} Items Packed • Expand to view
              </span>
            </div>
          )}

          <CompleteSprintModal
            isOpen={isCompleteSprintModalOpen}
            onClose={() => setIsCompleteSprintModalOpen(false)}
            projectId={projectId}
            sprint={sprint}
          />
        </div>
      </DroppableWrapper>
    );
  },
);

export default ScrumSprint;
