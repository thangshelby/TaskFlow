import { ITeam } from "@libs/types/team";
import { Users } from "lucide-react";

export const teamColors = [
  {
    textColor: "text-[#064e3b]",
    dotColor: "bg-[#064e3b]",
    bgColor: "bg-[#f0fdf4]",
    hoverBg: "hover:bg-[#f0fdf4]",
  },
  {
    textColor: "text-[#0369a1]",
    dotColor: "bg-[#0ea5e9]",
    bgColor: "bg-[#f0f9ff]",
    hoverBg: "hover:bg-[#f0f9ff]",
  },
  {
    textColor: "text-[#5b21b6]",
    dotColor: "bg-[#8b5cf6]",
    bgColor: "bg-[#f5f3ff]",
    hoverBg: "hover:bg-[#f5f3ff]",
  },
  {
    textColor: "text-[#059669]",
    dotColor: "bg-[#10b981]",
    bgColor: "bg-[#ecfdf5]",
    hoverBg: "hover:bg-[#ecfdf5]",
  },
  {
    textColor: "text-[#404944]",
    dotColor: "bg-[#404944]",
    bgColor: "bg-[#f9f9f8]",
    hoverBg: "hover:bg-[#f9f9f8]",
  },
  {
    textColor: "text-[#b45309]",
    dotColor: "bg-[#f59e0b]",
    bgColor: "bg-[#fffbeb]",
    hoverBg: "hover:bg-[#fffbeb]",
  },
];

const sizeClasses = {
  small: {
    button: "px-2 py-0.5 text-xs",
    icon: "w-3 h-3",
  },
  medium: {
    button: "px-3 py-1 text-sm",
    icon: "w-4 h-4",
  },
  large: {
    button: "px-4 py-1.5 text-base",
    icon: "w-5 h-5",
  },
};

const TeamBadge = ({
  team,
  size = "small",
  className,
  isShowLabel = true,
}: {
  team: ITeam;
  size?: "small" | "medium" | "large";
  className?: string;
  isShowLabel?: boolean;
}) => {
  if (!team) return <></>;

  // Use team ID to get consistent color
  const colorIndex = team.id.charCodeAt(0) % teamColors.length;
  const selectedColor = teamColors[colorIndex];

  return (
    <div
      className={`flex items-center gap-2 rounded-lg transition-colors duration-200 ${selectedColor.hoverBg} ${className}`}
    >
      <div
        className={`rounded-lg ${selectedColor.bgColor} flex items-center gap-1.5 ${sizeClasses[size].button} border-white/50 border`}
      >
        <Users
          className={`${sizeClasses[size].icon} ${selectedColor.textColor} opacity-80`}
        />
        {isShowLabel && (
          <p className={`truncate font-bold text-[10px] uppercase tracking-widest font-manrope ${selectedColor.textColor}`}>
            {team.name || "Unnamed Team"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamBadge;
