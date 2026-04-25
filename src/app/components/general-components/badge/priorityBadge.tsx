import { IssuePriority } from "@libs/types/issue";
import {
  ChevronUp,
  ChevronDown,
  Equal,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import React from "react";

export const priorityOptions: {
  name: IssuePriority;
  icon: React.ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
}[] = [
    {
      name: "Highest",
      icon: <ChevronsUp size={14} strokeWidth={3} />,
      textColor: "text-[#991b1b]",
      bgColor: "bg-[#fef2f2]",
      borderColor: "border-[#ef4444]/20",
    },
    {
      name: "High",
      icon: <ChevronUp size={14} strokeWidth={3} />,
      textColor: "text-[#b45309]",
      bgColor: "bg-[#fffbeb]",
      borderColor: "border-[#f59e0b]/20",
    },
    {
      name: "Medium",
      icon: <Equal size={14} strokeWidth={3} />,
      textColor: "text-[#064e3b]",
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#064e3b]/20",
    },
    {
      name: "Low",
      icon: <ChevronDown size={14} strokeWidth={3} />,
      textColor: "text-[#0369a1]",
      bgColor: "bg-[#f0f9ff]",
      borderColor: "border-[#0ea5e9]/20",
    },
    {
      name: "Lowest",
      icon: <ChevronsDown size={14} strokeWidth={3} />,
      textColor: "text-[#404944]/70",
      bgColor: "bg-[#f9f9f8]",
      borderColor: "border-[#e8e8e7]",
    },
  ];

const PriorityBadge = ({
  priority,
  isShowLabel,
  className = "",
}: {
  priority: IssuePriority;
  isShowLabel?: boolean;
  className?: string;
}) => {
  const currentPriority = priorityOptions.find(
    (option) => option.name === priority,
  ) || priorityOptions[2];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 shadow-sm font-manrope ${currentPriority.bgColor} ${currentPriority.borderColor} ${className}`}
    >
      <div className={`${currentPriority.textColor} shrink-0`}>
        {currentPriority.icon}
      </div>

      {isShowLabel && (
        <p className={`text-[10px] font-bold uppercase tracking-widest ${currentPriority.textColor}`}>
          {priority || "-"}
        </p>
      )}
    </div>
  );
};


export default PriorityBadge;
