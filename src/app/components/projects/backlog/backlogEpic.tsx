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

const BacklogEpic = ({ issues, handleToggleEpic }: { issues: IIssue[], handleToggleEpic: () => void }) => {
  const epicIssues = React.useMemo(() => getIssuesEpic(issues), [issues]);
  const issuesByEpic = React.useMemo(() => getIssuesByEpic(issues), [issues]);
  const { overItemId } = useOverItem();
  return (
    <div className="flex w-full flex-col gap-6 bg-white p-5 rounded-md border border-[#064e3b]/10 shadow-sm animate-in slide-in-from-left duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-black text-[#064e3b] font-manrope uppercase tracking-widest leading-none">
          Epics
        </h2>
        <button
          aria-label="Close Epic panel"
          className="group flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <IoClose size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <EpicIssueCardWrapper epicIssueId="no-epic">
          <div
            className={`flex items-center gap-3 rounded-md border px-4 py-3.5 transition-all cursor-pointer group ${overItemId === "no-epic"
              ? "bg-[#f0fdf4] border-[#064e3b] shadow-md"
              : "bg-[#f9f9f8] border-transparent hover:border-[#064e3b]/20 hover:shadow-sm"
              }`}
            onClick={handleToggleEpic}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-400 group-hover:text-[#064e3b] transition-colors shadow-sm">
              <CopyCheck size={16} />
            </div>
            <span className="text-[13px] font-bold text-[#064e3b]/80 font-manrope">
              No Epic
            </span>
          </div>
        </EpicIssueCardWrapper>

        <div className="flex flex-col gap-3">
          {epicIssues.map((epicIssue) => (
            <EpicIssueCard
              key={epicIssue.id}
              epicIssue={epicIssue}
              issuesByEpic={issuesByEpic}
            />
          ))}
        </div>
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
    const columnCounts: { [columnName: string]: number } = {
      TODO: 0,
      "IN PROGRESS": 0,
      DONE: 0,
    };
    epicIssues.forEach((issue) => {
      const status = issue.column?.name?.toUpperCase() || "TODO";
      if (status === "DONE") columnCounts["DONE"]++;
      else if (status === "IN PROGRESS" || status === "IN REVIEW") columnCounts["IN PROGRESS"]++;
      else columnCounts["TODO"]++;
    });
    return columnCounts;
  };

  const columnCounts = getIssueCountByColumn();
  const totalIssues = epicIssues.length;

  return (
    <EpicIssueCardWrapper epicIssueId={epicIssue.id}>
      <div
        className={`flex flex-col rounded-2xl border bg-white p-4 transition-all duration-300 ${isExpanded ? "border-[#064e3b]/20 shadow-lg" : "border-transparent bg-[#f9f9f8]"
          } ${overItemId === epicIssue.id ? "bg-[#f0fdf4] border-[#064e3b] scale-[1.02]" : ""}`}
      >
        <div
          className="flex flex-row items-center justify-between gap-2 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex min-w-0 flex-1 flex-row items-center gap-3">
            <FaChevronRight
              size={10}
              className={`text-[#064e3b]/30 transition-transform duration-300 ${isExpanded ? "rotate-90 text-[#064e3b]" : "group-hover:text-[#064e3b]"}`}
            />
            <div className="h-4 w-4 rounded-md bg-[#8465cb] shadow-sm shrink-0"></div>
            <span
              className="truncate text-[13px] font-bold text-[#064e3b] font-manrope"
              title={epicIssue.summary}
            >
              {epicIssue.summary}
            </span>
          </div>
          <button className="h-7 w-7 text-gray-400 hover:text-[#064e3b] transition-colors rounded-lg flex items-center justify-center hover:bg-white">
            <IoIosMore size={18} />
          </button>
        </div>

        {totalIssues > 0 && (
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden flex">
              {Object.entries(columnCounts).map(([columnName, count]) => {
                if (count === 0) return null;
                const percentage = (count / totalIssues) * 100;
                return (
                  <div
                    key={columnName}
                    className={`h-full transition-all duration-500 ${getColorByColumnName(columnName)}`}
                    style={{ width: `${percentage}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#064e3b]/40 font-manrope uppercase tracking-tight">
                {columnCounts["DONE"]} of {totalIssues} completed
              </span>
              <span className="text-[10px] font-black text-[#064e3b]/60 font-manrope bg-white px-2 py-0.5 rounded-full shadow-sm border border-[#064e3b]/5">
                {totalIssues} {totalIssues === 1 ? "ISSUE" : "ISSUES"}
              </span>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-[#064e3b]/30 uppercase tracking-widest font-manrope">
                  Start Date
                </span>
                <span className="text-[11px] font-bold text-[#064e3b]/60 font-manrope">
                  {epicIssue.due_date_from ? formatSprintDate(epicIssue.due_date_from) : "Not set"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-[#064e3b]/30 uppercase tracking-widest font-manrope">
                  Due Date
                </span>
                <span className="text-[11px] font-bold text-[#064e3b]/60 font-manrope">
                  {epicIssue.due_date_to ? formatSprintDate(epicIssue.due_date_to) : "Not set"}
                </span>
              </div>
            </div>

            <button
              className="w-full h-10 rounded-xl bg-[#064e3b] text-white text-[11px] font-black uppercase tracking-widest font-manrope hover:bg-[#059669] transition-all shadow-md active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                openIssueDetail(epicIssue.id);
              }}
            >
              View Full Details
            </button>
          </div>
        )}
      </div>
    </EpicIssueCardWrapper>
  );
};

function getColorByColumnName(columnName: string) {
  const name = columnName.toUpperCase();
  if (name === "DONE") return "bg-[#064e3b]";
  if (name === "IN PROGRESS") return "bg-[#059669]";
  return "bg-gray-300";
}

