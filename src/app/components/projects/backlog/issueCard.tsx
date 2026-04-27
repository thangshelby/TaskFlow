import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import { useState, useEffect, memo, useCallback, useRef } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../general-components/customInput";
import StatusDropdown from "../../general-components/dropdown/statusDropdown";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserDropdown from "../../general-components/dropdown/userDropdown";
import ParentDropdown from "../../general-components/dropdown/parentDropdown";
import CustomDatePicker from "../../general-components/customDatePicker";
import { useIssueStore } from "@libs/store/useIssueStore";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import { usePermission } from "@libs/hooks/common/usePermission";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { PermissionContext } from "@libs/app/context/permission.context";
import { useEditingIssue } from "@libs/app/context/backlog.context";

const DragableWrapper = memo(
  ({ issueId, children }: { issueId: string; children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: issueId,
        data: {
          type: "Issue",
        },
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        {children}
      </div>
    );
  },
);

const IssueCard = memo(
  ({ issue, projectId }: { issue: IIssue; projectId: string }) => {
    const navigate = useNavigate();
    const { openIssueDetail } = useIssueStore();
    const { user } = useAuthStore();
    const { userTeams } = useUserTeams(projectId, user?.id || "");

    const permissionResult = usePermission({
      user: user!,
      action: PERMISSIONS_CONFIG.issue?.update,
      resource: {
        issue: { issue: issue as IIssue, teams: userTeams! },
      },
    });

    const { updateIssueAsync } = useUpdateIssue({ projectId });
    const { columns } = useProjectColumns({ project_id: projectId });
    const [issueSummary, setIssueSummary] = useState(issue?.summary);
    const { editingIssueId, setEditingIssueId } = useEditingIssue();

    const stopPropagation = useCallback((e: React.PointerEvent) => {
      e.stopPropagation();
    }, []);

    const handleChangeIssueValue = useCallback(
      (field: string, value: string) => {
        updateIssueAsync({
          id: issue.id,
          data: {
            [field]: value,
          },
        });
      },
      [issue.id, updateIssueAsync],
    );

    const handleIssueCardClick = useCallback(() => {
      openIssueDetail(issue.id);
      navigate(`/projects/${projectId}/backlog?selectedIssue=${issue.id}`);
    }, [issue.id, openIssueDetail, navigate, projectId]);

    useEffect(() => {
      setIssueSummary(issue.summary);
    }, [issue.summary]);
    const ref = useRef<HTMLDivElement>(null);

    return (
      <DragableWrapper issueId={issue.id}>
        <div
          ref={ref}
          className={`group bg-white px-2 py-0.5 transition-all duration-200 hover:bg-[#064e3b]/2 border-b border-[#064e3b]/5 last:border-0`}
        >
          <PermissionContext.Provider value={permissionResult}>
            <div
              onClick={handleIssueCardClick}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              {/* IssueCardLeft */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex shrink-0 items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="cursor-grab active:cursor-grabbing text-gray-400">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                      <div className="h-0.5 w-0.5 rounded-full bg-current" />
                    </div>
                  </div>
                  <TypeBadge type={issue.type} isShowLabel={false} />
                  <span
                    className={`font-manrope text-xs font-black tracking-widest text-[#064e3b]/50 group-hover:text-[#064e3b] transition-colors ${issue?.column?.name === "DONE" ? "line-through opacity-50" : ""}`}
                  >
                    {issue?.key}
                  </span>
                </div>

                {/* ISSUE SUMMARY */}
                <div className="min-w-0 flex-1">
                  <CustomInput
                    field="summary"
                    value={issueSummary}
                    inputType="text"
                    handleUpdateIssue={handleChangeIssueValue}
                    containerClassName="flex items-center bg-transparent!"
                    contentClassName={`block text-[13px] font-bold truncate px-1 bg-transparent! font-manrope transition-colors ${issue?.column?.name === "DONE" ? "text-gray-400 line-through" : "text-[#064e3b] group-hover:text-[#064e3b]"}`}
                    isEditing={editingIssueId === `${issue.id}-summary` ? undefined : false}
                    onEditStart={() => setEditingIssueId(`${issue.id}-summary`)}
                    onEditCancel={() => setEditingIssueId(null)}
                  />
                </div>
              </div>

              {/* IssueCardRight */}
              <div
                className="flex items-center gap-3 shrink-0"
                onPointerDown={stopPropagation}
                onClick={(e) => e.stopPropagation()}
              >
                {/* parent dropdown */}
                <div className={`hidden lg:flex transition-all duration-300 ${issue.parent_id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <ParentDropdown
                    projectId={projectId}
                    issue={issue}
                    currentParentId={issue.parent_id}
                  />
                </div>

                {/* status dropdown */}
                <div className="origin-right w-[90px] overflow-hidden">
                  <StatusDropdown
                    projectId={projectId}
                    issueId={issue.id}
                    column={
                      issue.column
                    }
                  />
                </div>

                {/* due date to */}
                <div className="hidden sm:flex items-center w-[100px] origin-right opacity-50 group-hover:opacity-100 transition-opacity">
                  <CustomDatePicker
                    issueId={issue.id}
                    field="due_date_to"
                    projectId={projectId}
                  />
                </div>

                {/* story point */}
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#064e3b]/5 text-[9px] font-black font-manrope text-[#064e3b] transition-all group-hover:bg-[#064e3b]/10">
                  <CustomInput
                    field="story_point"
                    containerClassName="flex items-center justify-center"
                    value={issue.story_point || "0"}
                    handleUpdateIssue={handleChangeIssueValue}
                    isEditing={editingIssueId === `${issue.id}-story_point` ? undefined : false}
                    onEditStart={() => setEditingIssueId(`${issue.id}-story_point`)}
                    onEditCancel={() => setEditingIssueId(null)}
                    contentClassName="p-0 text-center"
                  />
                </div>

                {/* assignee */}
                <div className="flex h-6 w-6 items-center justify-center transition-all opacity-50 group-hover:opacity-100 group-hover:scale-110">
                  <UserDropdown
                    projectId={projectId}
                    issueId={issue.id}
                    selectedUserId={issue?.assignee_id || ""}
                    columnField="assignee_id"
                    isDisplayname={false}
                    user={issue.assignee}
                  />
                </div>
              </div>
            </div>
          </PermissionContext.Provider>
        </div>
      </DragableWrapper>
    );
  },
);

export default IssueCard;
