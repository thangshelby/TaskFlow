import TypeBadge from "../../general-components/badge/typeBadge";
import StatusBadge from "../../general-components/badge/statusBadge";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import { IIssue } from "@libs/types/issue";
import { useDraggable } from "@dnd-kit/core";

const IssueCardWrapper = ({
  issue,
  children,
}: {
  issue: IIssue;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: issue.id });

  const isDragging = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <div className={`${isDragging && "opacity-40"}`}>{children}</div>
    </div>
  );
};

const IssueCard = ({
  issue,
  isActive,
}: {
  issue: IIssue;
  isActive?: boolean;
}) => {
  return (
    <IssueCardWrapper issue={issue}>
      <div
        className={`flex flex-col gap-2 rounded-xs px-3 py-2 ${isActive ? "rounded-sm bg-green-100" : "bg-white"} `}
      >
        <p className="text-xs font-normal text-gray-800">{issue.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TypeBadge type={issue.type} isShowLabel={false} />
            <span className="text-sm font-semibold text-gray-800">
              {issue.key}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge column={issue.column} />
            <PriorityBadge priority={issue.priority} isShowLabel={false} />
          </div>
        </div>
      </div>
    </IssueCardWrapper>
  );
};

export default IssueCard;
