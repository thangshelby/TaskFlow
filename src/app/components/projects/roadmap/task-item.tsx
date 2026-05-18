import React, { useMemo } from "react";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import { IIssue } from "@libs/types/issue";
import { Clock } from "lucide-react";
import { FaCheck } from "react-icons/fa";
interface TaskItemProps {
  issue: IIssue;
  isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ issue, isDragging }) => {
  const isOverdue = useMemo(
    () =>
      new Date(issue.due_date_to!) < new Date() && issue.column.name !== "DONE",
    [issue],
  );

  const isDone = issue.column.name === "DONE";

  return (
    <div
      className={`group/task relative flex items-center gap-2 rounded-sm border p-1.5 transition-all duration-300 ${isOverdue
        ? "bg-[#fef2f2] border-red-100 hover:border-red-300"
        : isDone
          ? "bg-[#f0fdf4]/50 border-[#064e3b]/10 opacity-70"
          : "bg-white border-[#e8e8e7] hover:border-[#064e3b]/30 shadow-sm hover:shadow-md"
        } ${isDragging && "opacity-40"}`}
    >
      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${isDone
        ? "bg-[#064e3b] border-[#064e3b] text-white"
        : isOverdue
          ? "bg-white border-red-200 text-red-500"
          : "bg-white border-[#e8e8e7] text-[#064e3b]/30 group-hover/task:text-[#064e3b] group-hover/task:border-[#064e3b]/30"
        }`}>
        {isDone ? <FaCheck size={10} strokeWidth={8} /> : <div className="h-1.5 w-1.5 rounded-full bg-current" />}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[9px] font-black tracking-tight font-manrope ${isDone ? "text-[#064e3b]/40" : "text-[#064e3b]/30"}`}>
            {issue.key}
          </span>
          <PriorityBadge priority={issue.priority} isShowLabel={false} />
        </div>
        <span className={`truncate text-[11px] font-bold font-manrope leading-tight ${isDone ? "text-[#064e3b]/60 line-through" : "text-[#111827]"
          }`}>
          {issue.summary}
        </span>
      </div>

      {isOverdue && (
        <div className="absolute -top-1 -right-1">
          <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm ring-2 ring-white">
            <Clock size={8} />
          </div>
        </div>
      )}
    </div>
  );
};


export default TaskItem;
