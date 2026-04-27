import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { IIssue } from "@libs/types/issue";
import { formatDate } from "@libs/utils/date";
import { CiSettings } from "react-icons/ci";
import {
  StatusDropdown,
  PriorityDropdown,
  TypeDropdown,
  SprintDropdown,
  ParentDropdown,
} from "../../general-components/dropdown/index";
import UserAvatar from "../../general-components/user/userAvatar";
import CustomInput from "../../general-components/customInput";
import CustomDatePicker from "../../general-components/customDatePicker";
import UserDropdown from "../../general-components/dropdown/userDropdown";
import TeamDropdown from "../../general-components/dropdown/teamDropdown";
import { useIssue } from "@libs/hooks/apis/useIssue";

const DetailRow = ({
  label,
  layout,
  children,
}: {
  label: string;
  layout: "horizontal" | "vertical";
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`flex ${
        layout === "horizontal" ? "flex-col gap-4" : "flex-row items-center"
      }`}
    >
      <span className="min-w-[35%] text-xs font-semibold text-gray-700">
        {label}
      </span>
      <div className={layout === "horizontal" ? "w-full" : "w-2/3"}>
        {children}
      </div>
    </div>
  );
};

const Details = ({
  projectId,
  layout,
  selectedIssue,
  handleUpdateIssue,
}: {
  projectId: string;
  layout: "horizontal" | "vertical";
  selectedIssue: IIssue;
  handleUpdateIssue: (key: string, value: any) => void;
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const { issue } = useIssue(projectId, selectedIssue.id);
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="h-full overflow-y-auto rounded-xs border border-gray-300">
        <div
          className="flex cursor-pointer items-center rounded-xs border-2 border-transparent p-2 hover:bg-gray-200 active:border-emerald-500"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <div className="flex items-center gap-4">
            <div className="text-gray-500 hover:text-gray-700">
              {isDetailsOpen ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            <p className="text-sm font-bold text-gray-600">Details</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-gray-500 hover:text-gray-700">
              <CiSettings className="text-xl" />
            </div>
          </div>
        </div>
        {isDetailsOpen && (
          <div className="flex flex-col space-y-4 overflow-auto p-4">
            <DetailRow label="Assignee" layout={layout}>
              <UserDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                selectedUserId={selectedIssue.assignee_id || ""}
                columnField="assignee_id"
                isDisplayname={true}
              />
            </DetailRow>
            <DetailRow label="Sprint" layout={layout}>
              <SprintDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                sprintId={selectedIssue.sprint_id || ""}
              />
            </DetailRow>
            <DetailRow label="Parent" layout={layout}>
              <ParentDropdown
                projectId={projectId}
                issue={selectedIssue}
                currentParentId={selectedIssue.parent_id}
                isShowIcon={true}
              />
            </DetailRow>
            <DetailRow label="Priority" layout={layout}>
              <PriorityDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                priority={selectedIssue.priority}
                isShowLabel={true}
              />
            </DetailRow>
            <DetailRow label="Type" layout={layout}>
              <TypeDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                type={selectedIssue.type}
              />
            </DetailRow>
            <DetailRow label="Team" layout={layout}>
              <TeamDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                selectedTeamId={selectedIssue.team_id || ""}
                columnField="team_id"
                isDisplayName={true}
              />
            </DetailRow>
            <DetailRow label="Status" layout={layout}>
              <StatusDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                column={issue!.column}
              />
            </DetailRow>
            <DetailRow label="Story Points" layout={layout}>
              <CustomInput
                field="story_point"
                value={selectedIssue.story_point}
                handleUpdateIssue={handleUpdateIssue}
              />
            </DetailRow>
            <DetailRow label="Reporter" layout={layout}>
              <UserAvatar
                userId={selectedIssue?.reporter_id || ""}
                size={24}
                isDisplayName={true}
              />
            </DetailRow>
            <DetailRow label="Start Date" layout={layout}>
              <CustomDatePicker
                field="due_date_from"
                projectId={projectId}
                className="px-2"
                issueId={selectedIssue.id}
              />
            </DetailRow>
          </div>
        )}
      </div>

      {/* Date Section */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Created {formatDate(selectedIssue.created_at)}
        </p>
        <p className="text-sm text-gray-600">
          Updated {formatDate(selectedIssue.updated_at)}
        </p>
      </div>
    </div>
  );
};

export default Details;
