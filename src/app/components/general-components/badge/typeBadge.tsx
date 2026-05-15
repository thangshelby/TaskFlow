import { IssueType } from "@libs/types/issue";
import { LuBookmark, LuBug, LuClipboardCheck, LuStar } from "react-icons/lu";
import React from "react";
import { UISize, UI_COMMON_SIZES, getBadgeSizeClass } from "../constants/uiConfig";

export const typeOptions: {
  id: IssueType;
  name: string;
  icon: React.ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
}[] = [
    {
      id: "Bug",
      name: "Bug",
      icon: <LuBug size={14} />,
      textColor: "text-[#991b1b]",
      bgColor: "bg-[#fef2f2]",
      borderColor: "border-[#ef4444]/20",
    },
    {
      id: "Task",
      name: "Task",
      icon: <LuClipboardCheck size={14} />,
      textColor: "text-[#064e3b]",
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#064e3b]/20",
    },
    {
      id: "Story",
      name: "Story",
      icon: <LuBookmark size={14} />,
      textColor: "text-[#059669]",
      bgColor: "bg-[#ecfdf5]",
      borderColor: "border-[#10b981]/20",
    },
    {
      id: "Epic",
      name: "Epic",
      icon: <LuStar size={14} />,
      textColor: "text-[#5b21b6]",
      bgColor: "bg-[#f5f3ff]",
      borderColor: "border-[#8b5cf6]/20",
    },
  ];

const TypeBadge = ({
  type,
  isShowLabel = true,
  className = "",
  size = "small",
}: {
  type: IssueType;
  isShowLabel?: boolean;
  className?: string;
  size?: UISize;
}) => {
  const currentType = typeOptions.find((option) => option.name === type) || typeOptions[1];

  return (
    <div
      className={`inline-flex items-center gap-1.5 border shadow-sm font-manrope ${currentType.bgColor} ${currentType.borderColor} ${getBadgeSizeClass(size)} ${className}`}
    >
      <div className={`${currentType.textColor} shrink-0`}>
        {React.cloneElement(currentType.icon as React.ReactElement, {
          size: UI_COMMON_SIZES[size].iconSize,
          className: "shrink-0",
        } as any)}
      </div>

      {isShowLabel && (
        <p className={`font-bold uppercase tracking-widest ${currentType.textColor}`}>
          {type || "-"}
        </p>
      )}
    </div>
  );
};


export default TypeBadge;
