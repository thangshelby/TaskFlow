import { IIssue } from "@libs/types/issue";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserAvatar from "../../general-components/user/userAvatar";
import { FaBars } from "react-icons/fa";
import { useIssueStore } from "@libs/store/useIssueStore";
import { useFieldVisibility } from "@libs/app/context/board.context";
import { ParentBadge } from "../../general-components/dropdown/parentDropdown";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableIssue = ({
  issue,
  children,
}: {
  issue: IIssue;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: issue.id,
      data: {
        type: "Issue",
        issue,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      {children}
    </div>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const IssueCard = ({
  issue,
  isDragging,
}: {
  issue: IIssue;
  isDragging?: boolean;
}) => {
  const { openIssueDetail } = useIssueStore();
  const { fieldVisibility } = useFieldVisibility();

  return (
    <SortableIssue issue={issue}>
      <div
        className={`group cursor-pointer rounded-xs border border-[#e8e8e7] bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#064e3b]/30 hover:-translate-y-1 ${isDragging ? "opacity-40" : ""}`}
        onClick={() => {
          openIssueDetail(issue.id);
        }}
      >
        {/* Header with issue key and menu */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fieldVisibility.workType && (
              <div className="scale-90 origin-left">
                <TypeBadge type={issue.type} isShowLabel={false} />
              </div>
            )}
            {fieldVisibility.workItemKey && (
              <span className="text-[10px] font-black text-[#064e3b]/40 tracking-tighter font-manrope">{issue.key}</span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              onClick={(e) => {
                e.stopPropagation();
                openIssueDetail(issue.id);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#064e3b] transition-colors"
            >
              <FaBars size={12} />
            </div>
          </div>
        </div>

        {/* Issue title */}
        <h3 className="mb-1.5 line-clamp-2 text-[13px] font-bold text-[#111827] font-manrope leading-normal group-hover:text-[#064e3b] transition-colors">
          {issue.summary}
        </h3>

        {/* Issue metadata */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {fieldVisibility.priority && (
            <div className="scale-90 origin-left">
              <PriorityBadge priority={issue.priority} isShowLabel={false} />
            </div>
          )}

          {fieldVisibility.estimate && issue.story_point > 0 && (
            <span className="rounded-md bg-[#f1f5f3] px-2 py-0.5 text-[9px] font-black text-[#064e3b] uppercase tracking-wider border border-[#064e3b]/10">
              {issue.story_point} {issue.story_point === 1 ? "PT" : "PTS"}
            </span>
          )}

          {issue.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
              <span>📎</span>
              <span>{issue.attachments.length}</span>
            </div>
          )}

          {fieldVisibility.epic && issue.parent_id && (
            <div className="ml-auto scale-90 origin-right">
              <ParentBadge issueId={issue.parent_id} />
            </div>
          )}
        </div>

        {/* Footer with assignee and date */}
        <div className="flex items-center justify-between border-t border-[#f3f4f1] pt-3 mt-auto">
          <div className="flex items-center gap-2">
            {fieldVisibility.assignee && (
              <div className="ring-2 ring-white rounded-full shadow-sm">
                <UserAvatar size={24} userId={issue.assignee_id} />
              </div>
            )}
            <div className="flex flex-col">
              {fieldVisibility.dueDate && (
                <span className="text-[9px] font-bold text-gray-400 font-manrope leading-tight">
                  {formatDate(issue.created_at)}
                </span>
              )}
            </div>
          </div>

          <div className="h-1.5 w-1.5 rounded-full bg-[#064e3b]/20" />
        </div>
      </div>
    </SortableIssue>
  );
};

export default IssueCard;
