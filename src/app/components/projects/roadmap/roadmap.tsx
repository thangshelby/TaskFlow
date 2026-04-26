import TaskItem from "./task-item";
import { IIssue } from "@libs/types/issue";
import RoadmapSkeleton from "../../skeleton/roadmapSkeleton";
import { SortableContext } from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Popover } from "antd";
import dayjs from "dayjs";

interface RoadmapProps {
  calendarDays: Record<string, IIssue[]>;
  isLoadingProjectIssues: boolean;
  activeDate: string;
}

const Roadmap: React.FC<RoadmapProps> = ({
  isLoadingProjectIssues,
  calendarDays,
  activeDate,
}) => {
  return (
    <div className="flex h-full w-full flex-col bg-white/50 backdrop-blur-sm rounded-lg border border-[#e8e8e7] overflow-hidden shadow-sm">
      {isLoadingProjectIssues ? (
        <RoadmapSkeleton />
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-5 border-b border-[#e8e8e7] bg-[#f9f9f8]/50">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[11px] font-bold text-[#064e3b]/70 font-manrope uppercase tracking-widest"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-5 flex-1 overflow-y-auto custom-scrollbar">
            {Object.keys(calendarDays).map((dateStr: string) => (
              <DropableDate
                key={dateStr}
                dateStr={dateStr}
                issues={calendarDays[dateStr]}
                isActive={activeDate === dateStr}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;

const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: issue.id,
  });
  const isDragging = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab transition-transform active:scale-95 ${isDragging ? "z-50" : ""}`}
    >
      <TaskItem issue={issue} isDragging={isDragging} />
    </div>
  );
};

const DropableDate = ({
  dateStr,
  issues,
  isActive,
}: {
  dateStr: string;
  issues: IIssue[];
  isActive: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: dateStr,
    data: {
      type: "date",
      date: dateStr,
    },
  });

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date: Date): boolean => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const dateObj = new Date(dateStr);

  return (
    <div ref={setNodeRef} className="h-full">
      <SortableContext items={issues.map((issue) => issue.id)}>
        <div
          className={`h-44 min-h-[160px] border-r border-b border-[#e8e8e7] p-3 transition-all duration-200 group flex flex-col ${isToday(dateObj) ? "bg-[#f0fdf4]/30" : "bg-white/40"
            } ${isWeekend(dateObj) ? "hidden" : "hover:bg-[#f9f9f8]"} ${isActive ? "bg-[#f0fdf4] ring-2 ring-inset ring-[#064e3b]/20" : ""
            }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-bold font-manrope ${isToday(dateObj)
                ? "flex h-7 w-7 items-center justify-center rounded-full bg-[#064e3b] text-white shadow-lg"
                : "text-[#064e3b]/70 group-hover:text-[#064e3b]"
                }`}
            >
              {dateObj.getDate()}
            </span>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            {issues.slice(0, 2).map((issue) => (
              <SortableIssue key={issue.id} issue={issue} />
            ))}

            {issues.length > 2 && (
              <Popover
                placement="top"
                trigger="click"
                content={
                  <div className="flex w-64 flex-col gap-3 p-2">
                    <div className="flex items-center justify-between border-b border-[#f3f4f1] pb-2">
                      <h5 className="text-[11px] font-black text-[#064e3b] font-manrope uppercase tracking-widest">
                        {dayjs(dateObj).format("MMMM D")}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar p-2">
                      {issues.map((issue) => (
                        <SortableIssue key={issue.id} issue={issue} />
                      ))}
                    </div>
                  </div>
                }
              >
                <div className="mt-auto py-1 text-[10px] font-bold text-[#064e3b]/80 hover:text-[#064e3b] hover:bg-[#064e3b]/5 rounded-md text-center cursor-pointer transition-colors font-manrope uppercase tracking-wider">
                  + {issues.length - 2} more
                </div>
              </Popover>
            )}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};

