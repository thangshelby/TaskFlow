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
  hoverBg: string;
}[] = [
    {
      name: "Highest",
      icon: <ChevronsUp size={18} strokeWidth={3.5} className="text-[#BA1A1A]" />,
      textColor: "text-[#BA1A1A]",
      hoverBg: "hover:bg-red-50",
    },
    {
      name: "High",
      icon: <ChevronUp size={18} strokeWidth={3.5} className="text-[#FF0000]" />,
      textColor: "text-[#FF0000]",
      hoverBg: "hover:bg-red-50",
    },
    {
      name: "Medium",
      icon: <Equal size={18} strokeWidth={3.5} className="text-[#064E3B]" />,
      textColor: "text-[#064E3B]",
      hoverBg: "hover:bg-orange-50",
    },
    {
      name: "Low",
      icon: (
        <ChevronDown size={18} strokeWidth={3.5} className="text-gray-800" />
      ),
      textColor: "text-gray-800",
      hoverBg: "hover:bg-green-50",
    },
    {
      name: "Lowest",
      icon: (
        <ChevronsDown size={18} strokeWidth={3.5} className="text-gray-400" />
      ),
      textColor: "text-gray-400",
      hoverBg: "hover:bg-blue-50",
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
  );
  return (
    <div
      className={`flex items-center gap-2 rounded-full transition-colors duration-200 hover:bg-gray-100 ${className}`}
    >
      <div className="shrink-0">{currentPriority?.icon}</div>

      {isShowLabel && (
        <p className={`truncate text-[13px] font-semibold text-gray-700`}>
          {priority || "-"}
        </p>
      )}
    </div>
  );
};

export default PriorityBadge;
