import { useMemo } from "react";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
export const statusColors = [
  {
    key: "todo",
    textColor: "text-[#404944]/70",
    borderColor: "border-[#e8e8e7]",
    bgColor: "bg-[#f9f9f8]",
  },
  {
    key: "inprogress",
    textColor: "text-[#064e3b]",
    borderColor: "border-[#064e3b]/20",
    bgColor: "bg-[#f0fdf4]",
  },
  {
    key: "done",
    textColor: "text-[#059669]",
    borderColor: "border-[#059669]/20",
    bgColor: "bg-[#ecfdf5]",
  },
  {
    key: "review",
    textColor: "text-[#b45309]",
    borderColor: "border-[#f59e0b]/20",
    bgColor: "bg-[#fffbeb]",
  },
  {
    key: "blocked",
    textColor: "text-[#991b1b]",
    borderColor: "border-[#ef4444]/20",
    bgColor: "bg-[#fef2f2]",
  },
  {
    key: "stage",
    textColor: "text-[#0369a1]",
    borderColor: "border-[#0ea5e9]/20",
    bgColor: "bg-[#f0f9ff]",
  },
];

const StatusBadge = ({
  column,
  columnId,
  projectId,
  className,
}: {
  column?: {
    name: string;
    order: number;
  };
  projectId?: string;
  columnId?: string;
  className?: string;
}) => {
  const { columns } = useProjectColumns({ project_id: projectId || "" });
  const selectedColumn = columns.find((c) => c.id === columnId);

  const statusInfo = useMemo(() => {
    const name = (column?.name || selectedColumn?.name || "").toUpperCase();

    if (name === "DONE" || name === "COMPLETED" || name === "RESOLVED")
      return statusColors[2];
    if (name === "IN PROGRESS" || name === "ACTIVE" || name === "DOING")
      return statusColors[1];
    if (name === "TODO" || name === "BACKLOG" || name === "OPEN")
      return statusColors[0];
    if (name.includes("REVIEW") || name.includes("FEEDBACK") || name.includes("PREVIEW"))
      return statusColors[3];
    if (name.includes("BLOCK") || name.includes("STOP") || name.includes("URGENT"))
      return statusColors[4];

    return statusColors[5]; // Default stage
  }, [column, selectedColumn]);

  if (!selectedColumn && !column) return <></>;

  return (
    <div
      className={`flex items-center justify-center w-full min-w-0 rounded-xs border px-1.5 py-1 shadow-sm font-manrope ${statusInfo.bgColor} ${statusInfo.borderColor} ${className}`}
    >
      <p
        className={`truncate text-[10px] font-extrabold uppercase tracking-widest ${statusInfo.textColor}`}
      >
        {column
          ? column.name
          : selectedColumn?.name || ""}
      </p>
    </div>
  );
};


export default StatusBadge;
