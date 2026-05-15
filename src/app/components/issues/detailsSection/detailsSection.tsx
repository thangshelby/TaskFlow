import { IIssue } from "@libs/types/issue";
import { formatDate } from "@libs/utils/date";
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
      <span className="min-w-[35%] text-xs font-semibold text-[#064e3b]/70">
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
  const { issue } = useIssue(projectId, selectedIssue.id);
  return (
    <div className="flex h-full flex-col gap-6 font-manrope">
      <div className="flex flex-col space-y-5">
        <DetailRow label="Assignee" layout={layout}>
          <UserDropdown
            projectId={projectId}
            issueId={selectedIssue.id}
            selectedUserId={selectedIssue.assignee_id || ""}
            columnField="assignee_id"
            isDisplayname={true}
          />
        </DetailRow>
        
        <DetailRow label="Reporter" layout={layout}>
          <div className="bg-[#fcfcfb]/50 p-1.5 rounded-md border border-[#064e3b]/5 flex items-center gap-2">
            <UserAvatar
              userId={selectedIssue?.reporter_id || ""}
              size={24}
              isDisplayName={true}
            />
          </div>
        </DetailRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 py-4 border-y border-[#064e3b]/5">
          <DetailRow label="Status" layout={layout}>
            <StatusDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              column={issue!.column}
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

          <DetailRow label="Sprint" layout={layout}>
            <SprintDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              sprintId={selectedIssue.sprint_id || ""}
            />
          </DetailRow>

          <DetailRow label="Story Points" layout={layout}>
            <div className="space-y-1 rounded-md border border-[#064e3b]/5 bg-[#fcfcfb]/30 p-2 shadow-inner-sm">
              <CustomInput
                field="story_point"
                value={selectedIssue.story_point}
                handleUpdateIssue={handleUpdateIssue}
                containerClassName="flex items-center"
                contentClassName="text-sm font-black! text-[#064e3b] p-0"
              />
            </div>
          </DetailRow>

          <DetailRow label="Type" layout={layout}>
            <TypeDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              type={selectedIssue.type}
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
        </div>

        <div className="space-y-4 pt-2">
          <DetailRow label="Team" layout={layout}>
            <TeamDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              selectedTeamId={selectedIssue.team_id || ""}
              columnField="team_id"
              isDisplayName={true}
            />
          </DetailRow>

          <DetailRow label="Dates" layout={layout}>
            <div className="flex items-center gap-2 bg-[#fcfcfb]/50 p-1 rounded-md border border-[#064e3b]/5">
              <CustomDatePicker
                field="due_date_from"
                projectId={projectId}
                issueId={selectedIssue.id}
                className="flex-1"
              />
              <span className="text-[#064e3b]/40 text-xs">→</span>
              <CustomDatePicker
                field="due_date_to"
                projectId={projectId}
                issueId={selectedIssue.id}
                className="flex-1"
              />
            </div>
          </DetailRow>
        </div>
      </div>

      {/* Audit Section */}
      <div className="mt-4 flex flex-col gap-1 px-1">
        <p className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">
          Created {formatDate(selectedIssue.created_at)}
        </p>
        <p className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">
          Updated {formatDate(selectedIssue.updated_at)}
        </p>
      </div>
    </div>
  );
};

export default Details;
