import React from "react";
import { IssuePriority } from "@libs/types/issue";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
  MdRemove,
} from "react-icons/md";
import {
  UISize,
  UI_COMMON_SIZES,
  getBadgeSizeClass,
} from "../constants/uiConfig";

export const priorityOptions = [
  {
    name: "Lowest",
    icon: <MdOutlineKeyboardArrowDown size={14} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200/50",
  },
  {
    name: "Low",
    icon: <MdOutlineKeyboardArrowDown size={14} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200/50",
  },
  {
    name: "Medium",
    icon: <MdRemove size={14} />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200/50",
  },
  {
    name: "High",
    icon: <MdOutlineKeyboardArrowUp size={14} />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200/50",
  },
  {
    name: "Highest",
    icon: <MdOutlineKeyboardDoubleArrowUp size={14} />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200/50",
  },
];

const PriorityBadge = ({
  priority,
  isShowLabel = true,
  className = "",
  size = "small",
}: {
  priority: IssuePriority;
  isShowLabel?: boolean;
  className?: string;
  size?: UISize;
}) => {
  const currentPriority =
    priorityOptions.find((option) => option.name === priority) ||
    priorityOptions[2];

  return (
    <div
      className={`inline-flex items-center gap-1.5 border shadow-sm font-manrope ${currentPriority.bgColor} ${currentPriority.borderColor} ${getBadgeSizeClass(size)} ${className}`}
    >
      <div className={`${currentPriority.color} shrink-0`}>
        {React.cloneElement(currentPriority.icon as React.ReactElement, {
          size: UI_COMMON_SIZES[size].iconSize,
          className: "shrink-0",
        } as any)}
      </div>
      {isShowLabel && (
        <span
          className={`font-bold uppercase tracking-widest ${currentPriority.color}`}
        >
          {priority}
        </span>
      )}
    </div>
  );
};

export default PriorityBadge;
