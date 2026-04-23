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
          className={`group bg-white px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-100`}
        >
          <PermissionContext.Provider value={permissionResult}>
            <div
              onClick={() => {
                handleIssueCardClick();
              }}
              className="flex cursor-pointer items-center gap-4"
            >
              {/* IssueCardLeft */}
              <div className="group inline-block w-full flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex flex-row items-center">
                    <TypeBadge type={issue.type} isShowLabel={false} />

                    <span
                      className={`block cursor-pointer text-xs font-medium text-blue-600 hover:underline ${issue?.column?.name === "DONE" ? "line-through" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openIssueDetail(issue.id);
                        navigate(
                          `/projects/${projectId}/backlog?selectedIssue=${issue.id}`,
                        );
                      }}
                    >
                      {issue?.key}
                    </span>
                  </div>
                  {/* ISSUE SUMMARY */}
                  <div
                    className="group relative w-auto min-w-0"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CustomInput
                      field="summary"
                      value={issueSummary}
                      inputType="text"
                      handleUpdateIssue={handleChangeIssueValue}
                      containerClassName="flex items-center justify-center bg-transparent! flex  text-clip hover:text-underline! inline-block"
                      contentClassName="block text-sm truncate px-1  bg-transparent! text-gray-500 hover:text-underline!"
                    />
                  </div>
                </div>
              </div>
              {/* IssueCardRight */}
              <div
                className="grid w-[35%] max-w-[50%] min-w-[400px] grid-cols-12 gap-1"
                onPointerDown={stopPropagation}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {/* parent dropdown */}
                <div className="col-span-4 flex items-center hover:cursor-pointer">
                  <ParentDropdown
                    projectId={projectId}
                    issue={issue}
                    currentParentId={issue.parent_id}
                  />
                </div>
                {/* status dropdown */}
                <div className="col-span-3 flex items-center">
                  <StatusDropdown
                    projectId={projectId}
                    issueId={issue.id}
                    column={
                      columns.find((col) => col.id === issue.column.id) ||
                      columns[0]
                    }
                  />
                </div>
                {/* due date to */}
                <div className="col-span-3 flex items-center">
                  <CustomDatePicker
                    issueId={issue.id}
                    field="due_date_to"
                    projectId={projectId}
                  />
                </div>
                {/* {/* story point */}
                <div className="col-span-1 flex items-center">
                  <div className="flex w-full items-center justify-center">
                    <CustomInput
                      field="story_point"
                      containerClassName="flex items-center justify-center"
                      value={issue.story_point || "-"}
                      handleUpdateIssue={handleChangeIssueValue}
                    />
                  </div>
                </div>
                {/* assignee */}
                <div className="col-span-1 flex items-center">
                  <UserDropdown
                    projectId={projectId}
                    issueId={issue.id}
                    selectedUserId={issue?.assignee_id || ""}
                    columnField="assignee_id"
                    isDisplayname={false}
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
