import { ITeam } from "@libs/types/team";
import { Users } from "lucide-react";

export const teamColors = [
  {
    textColor: "text-[#064e3b]",
    dotColor: "bg-[#064e3b]",
    bgColor: "bg-[#f0fdf4]",
    hoverBg: "hover:bg-[#f0fdf4]",
    borderColor: "border-[#064e3b]/20",
  },
  {
    textColor: "text-[#0369a1]",
    dotColor: "bg-[#0ea5e9]",
    bgColor: "bg-[#f0f9ff]",
    hoverBg: "hover:bg-[#f0f9ff]",
    borderColor: "border-[#0ea5e9]/20",
  },
  {
    textColor: "text-[#5b21b6]",
    dotColor: "bg-[#8b5cf6]",
    bgColor: "bg-[#f5f3ff]",
    hoverBg: "hover:bg-[#f5f3ff]",
    borderColor: "border-[#8b5cf6]/20",
  },
  {
    textColor: "text-[#059669]",
    dotColor: "bg-[#10b981]",
    bgColor: "bg-[#ecfdf5]",
    hoverBg: "hover:bg-[#ecfdf5]",
    borderColor: "border-[#10b981]/20",
  },
  {
    textColor: "text-[#404944]",
    dotColor: "bg-[#404944]",
    bgColor: "bg-[#f9f9f8]",
    hoverBg: "hover:bg-[#f9f9f8]",
    borderColor: "border-[#e8e8e7]",
  },
  {
    textColor: "text-[#b45309]",
    dotColor: "bg-[#f59e0b]",
    bgColor: "bg-[#fffbeb]",
    hoverBg: "hover:bg-[#fffbeb]",
    borderColor: "border-[#f59e0b]/20",
  },
];

import {
  UISize,
  UI_COMMON_SIZES,
  getBadgeSizeClass,
} from "../constants/uiConfig";

const TeamBadge = ({
  team,
  size = "small",
  className,
  isShowLabel = true,
}: {
  team: ITeam;
  size?: UISize;
  className?: string;
  isShowLabel?: boolean;
}) => {
  if (!team) return <></>;

  // Use team ID to get consistent color
  const colorIndex = team.id.charCodeAt(0) % teamColors.length;
  const selectedColor = teamColors[colorIndex];

  return (
    <div
      className={`inline-flex items-center justify-center border shadow-sm font-manrope ${selectedColor.bgColor} ${selectedColor.borderColor} ${getBadgeSizeClass(size)} ${className}`}
    >
      <Users
        size={UI_COMMON_SIZES[size].iconSize}
        className={`${selectedColor.textColor} opacity-80 shrink-0 mr-1.5`}
      />
      {isShowLabel && (
        <p className={`truncate font-bold uppercase tracking-widest ${selectedColor.textColor}`}>
          {team.name || "Unnamed Team"}
        </p>
      )}
    </div>
  );
};

export default TeamBadge;
