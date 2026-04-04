import { useMemo } from "react";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
export const statusColors = [
  {
    order: 1,
    textColor: "text-slate-700",
    dotColor: "border-slate-400",
    bgColor: "bg-slate-200",
    hoverBg: "hover:bg-slate-50",
  },
  {
    order: 2,
    textColor: "text-sky-700",
    dotColor: "border-sky-400",
    bgColor: "bg-sky-200",
    hoverBg: "hover:bg-sky-50",
  },
  {
    order: 3,
    textColor: "text-emerald-700",
    dotColor: "border-emerald-400",
    bgColor: "bg-emerald-200",
    hoverBg: "hover:bg-emerald-50",
  },
  {
    order: 4,
    textColor: "text-amber-700",
    dotColor: "border-amber-400",
    bgColor: "bg-amber-200",
    hoverBg: "hover:bg-amber-50",
  },
  {
    order: 5,
    textColor: "text-rose-700",
    dotColor: "border-rose-400",
    bgColor: "bg-rose-200",
    hoverBg: "hover:bg-rose-50",
  },
  {
    order: 6,
    textColor: "text-violet-700",
    dotColor: "border-violet-400",
    bgColor: "bg-violet-200",
    hoverBg: "hover:bg-violet-50",
  },
  {
    order: 7,
    textColor: "text-cyan-700",
    dotColor: "border-cyan-400",
    bgColor: "bg-cyan-200",
    hoverBg: "hover:bg-cyan-50",
  },
  {
    order: 8,
    textColor: "text-indigo-700",
    dotColor: "border-indigo-400",
    bgColor: "bg-indigo-200",
    hoverBg: "hover:bg-indigo-50",
  },
];

// const sizeClasses = {
//   small: {
//     button: "px-2 py-0.5 text-xs",
//     dot: "w-1.5 h-1.5",
//   },
//   medium: {
//     button: "px-3 py-1 text-sm",
//     dot: "w-2 h-2",
//   },
//   large: {
//     button: "px-4 py-1.5 text-base",
//     dot: "w-2.5 h-2.5",
//   },
// };

const StatusBadge = ({
  column,
  columnId,
  projectId,
  // size = "small",
  className,
}: {
  column?: {
    name: string;
    order: number;
  };
  projectId?: string;
  columnId?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}) => {
  const { columns } = useProjectColumns({ project_id: projectId || "" });
  const selectedColumn = columns.find((c) => c.id === columnId);

  const index = useMemo(() => {
    if (!column && !selectedColumn) return -1;
    if (column ? column.name === "DONE" : selectedColumn?.name === "DONE")
      return 2;
    if (
      column
        ? column.name === "IN PROGRESS"
        : selectedColumn?.name === "IN PROGRESS"
    )
      return 1;
    if (column ? column.name === "TODO" : selectedColumn?.name === "TODO")
      return 0;
    return 1;
  }, [column, selectedColumn]);
  if (!selectedColumn && !column) return <></>;
  return (
    <div
      className={`inline-block rounded-sm border ${className} px-1 py-0.5 ${statusColors[index].bgColor} ${statusColors[index].dotColor}`}
    >
      <p
        className={`truncate text-xs font-semibold ${statusColors[index].textColor} `}
      >
        {column
          ? column.name.toUpperCase()
          : selectedColumn?.name.toUpperCase() || ""}
      </p>
    </div>
  );
};

export default StatusBadge;
