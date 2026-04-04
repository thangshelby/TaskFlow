import React from "react";
import { IIssue } from "@libs/types/issue";
import { getIssuesByEpic, getIssuesEpic } from "@libs/utils/issue";
import { IoClose } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { CopyCheck } from "lucide-react";
import { formatSprintDate } from "@libs/utils/date";
import { useDroppable } from "@dnd-kit/core";
import { useIssueStore } from "@libs/store/useIssueStore";
import { useOverItem } from "@libs/app/context/backlog.context";

const EpicIssueCardWrapper = ({
  children,
  epicIssueId,
}: {
  children: React.ReactNode;
  epicIssueId: string;
}) => {
  const { setNodeRef } = useDroppable({
    id: epicIssueId,
    data: {
      type: "epic",
      issue: { id: epicIssueId },
    },
  });
  return <div ref={setNodeRef}>{children}</div>;
};

const BacklogEpic = ({ issues }: { issues: IIssue[] }) => {
  const epicIssues = React.useMemo(() => getIssuesEpic(issues), [issues]);
  const issuesByEpic = React.useMemo(() => getIssuesByEpic(issues), [issues]);
  const { overItemId } = useOverItem();
  return (
    <div className="flex w-full flex-col gap-3 bg-[#f8f8f8] p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-900">Epic</h1>
        <button
          aria-label="Close Epic panel"
          className="rounded p-1 hover:bg-gray-200"
        >
          <IoClose className="text-gray-500" size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <EpicIssueCardWrapper epicIssueId="no-epic">
          <div
            className={`flex gap-2 rounded-sm px-4 py-3 transition-shadow hover:border-gray-300 hover:bg-gray-200 hover:shadow-sm ${overItemId === "no-epic" ? "bg-green-200!" : ""}`}
          >
            <CopyCheck className="text-gray-500" size={16} />
            <span className="truncate text-sm font-medium text-gray-900">
              No Epic
            </span>
          </div>
        </EpicIssueCardWrapper>
        {epicIssues.map((epicIssue) => {
          return (
            <EpicIssueCard
              key={epicIssue.id}
              epicIssue={epicIssue}
              issuesByEpic={issuesByEpic}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(BacklogEpic);

const EpicIssueCard = ({
  epicIssue,
  issuesByEpic,
}: {
  epicIssue: IIssue;
  issuesByEpic: { [epicId: string]: IIssue[] };
}) => {
  const { overItemId } = useOverItem();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const { openIssueDetail } = useIssueStore();
  const epicIssues = issuesByEpic[epicIssue.id] || [];

  const getIssueCountByColumn = () => {
    const columnCounts: { [columnName: string]: number } = {};
    columnCounts["TODO"] = epicIssues.filter(
      (issue) => issue.column?.name === "TODO",
    ).length;
    columnCounts["IN PROGRESS"] = epicIssues.filter(
      (issue) =>
        issue.column?.name === "IN PROGRESS" ||
        !["DONE", "In Progress"].includes(issue.column?.name || ""),
    ).length;
    columnCounts["DONE"] = epicIssues.filter(
      (issue) => issue.column?.name === "DONE",
    ).length;
    return columnCounts;
  };

  const columnCounts = getIssueCountByColumn();
  const totalIssues = epicIssues.length;
  return (
    <EpicIssueCardWrapper epicIssueId={epicIssue.id}>
      <div
        className={`flex flex-col rounded-md border bg-white px-4 py-3 transition-shadow hover:border-gray-300 hover:bg-gray-200 hover:shadow-sm ${
          isExpanded ? "border-gray-300" : "border-transparent"
        } ${overItemId === epicIssue.id ? "bg-green-200!" : ""}`}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <FaChevronRight
              size={12}
              className={`mr-2 inline-block text-gray-500 ${isExpanded ? "rotate-90" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            />
            <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
            <span
              className="line-clamp-1 truncate text-sm font-medium text-gray-900"
              title={epicIssue.summary}
            >
              {epicIssue.summary}
            </span>
          </div>
          <IoIosMore className="text-gray-500" size={20} />
        </div>

        {totalIssues > 0 && (
          <div className="mt-2">
            <div className="h-1 w-full rounded-full bg-gray-200">
              <div className="flex h-full space-x-[1px] overflow-hidden rounded-full">
                {Object.entries(columnCounts).map(([columnName, count]) => {
                  const percentage = (count / totalIssues) * 100;
                  return (
                    <div
                      key={columnName}
                      className={`h-full rounded-2xl ${getColorByColumnName(columnName) || "bg-gray-400"}`}
                      style={{ width: `${percentage}%` }}
                      title={`${columnName}: ${count} issues (${percentage.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
              <span>
                {columnCounts["DONE"] || columnCounts["Done"] || 0} of{" "}
                {totalIssues} done
              </span>
              <span className="text-gray-500">
                {Object.values(columnCounts).reduce((a, b) => a + b, 0)} issues
              </span>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-800">
                Start date
              </span>
              <span className="text-xs text-gray-600">
                {epicIssue.due_date_from
                  ? formatSprintDate(epicIssue.due_date_from)
                  : "None"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-800">
                Due date
              </span>
              <span className="text-xs text-gray-600">
                {epicIssue.due_date_to
                  ? formatSprintDate(epicIssue.due_date_to)
                  : "None"}
              </span>
            </div>

            <div className="col-span-2">
              <button
                className="bgg- w-full cursor-pointer rounded border border-gray-300 bg-transparent py-1 text-center text-sm font-semibold text-gray-700 hover:bg-gray-300"
                onClick={() => openIssueDetail(epicIssue.id)}
              >
                View all details
              </button>
            </div>
          </div>
        )}
      </div>
    </EpicIssueCardWrapper>
  );
};

function getColorByColumnName(columnName: string) {
  const name = columnName.toUpperCase();
  if (name === "TO DO" || name === "TODO") return "bg-gray-500";
  if (name === "IN PROGRESS") return "bg-blue-500";
  if (name === "DONE") return "bg-green-500";
  return "bg-blue-500";
}
