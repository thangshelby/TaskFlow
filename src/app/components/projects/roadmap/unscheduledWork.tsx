import React, { memo, useMemo } from "react";
import { Input, ConfigProvider, Popover } from "antd";
import { ChevronDown, ListFilter, X } from "lucide-react";
import IssueCard from "./issueCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";

interface UnscheduledWorkProps {
  handleToggleUnscheduledWork: () => void;
  isOver?: boolean;
  projectId: string;
}

const UnscheduledWork: React.FC<UnscheduledWorkProps> = memo(
  ({ handleToggleUnscheduledWork, isOver = false, projectId }) => {
    const { setNodeRef, isOver: isDroppableOver } = useDroppable({
      id: "unscheduled-work",
      data: { type: "unscheduled-work" },
    });
    const [isSort, setIsSort] = React.useState(false);

    const { issues, isLoading } = useProjectIssues({
      project_id: projectId,
      due_date_to: "unassigned",
      is_fetch: true,
    });

    const sortedIssues = useMemo(() => {
      return [...issues].sort((a, b) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
    }, [issues]);

    if (isLoading) {
      return null;
    }

    return (
      <div
        ref={setNodeRef}
        className="flex h-full w-full flex-col gap-6 rounded-md bg-white p-4 shadow-lg border border-[#064e3b]/10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-black text-[#064e3b] font-manrope uppercase tracking-widest leading-none">
              Issue Backlog
            </h2>
            <button
              onClick={handleToggleUnscheduledWork}
              aria-label="Close backlog"
              className="group flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#064e3b]/70 font-manrope">
            Drag items onto the calendar to set deadlines
          </p>
        </div>

        {/* Search */}
        <div className="relative group">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#064e3b",
                borderRadius: 12,
                fontFamily: "Manrope",
              },
              components: {
                Input: {
                  colorBgContainer: "#f9f9f8",
                  colorBorder: "#e8e8e7",
                  activeBorderColor: "#064e3b",
                  hoverBorderColor: "#064e3b",
                },
              },
            }}
          >
            <Input.Search
              size="large"
              placeholder="Search unassigned items..."
              className="premium-search"
              allowClear
            />
          </ConfigProvider>
        </div>

        {/* List Section */}
        <div
          className={`relative flex flex-1 flex-col overflow-hidden rounded-lg border transition-all duration-300 ${(isOver || isDroppableOver)
            ? "bg-[#f0fdf4] border-[#064e3b] scale-[1.02] shadow-xl"
            : "bg-[#f9f9f8]/50 border-[#e8e8e7]"
            }`}
        >
          {/* List Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-[#e8e8e7] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <button
              onClick={() => setIsSort(!isSort)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all hover:bg-[#064e3b]/5 text-[#064e3b]/80 hover:text-[#064e3b]"
            >
              <span className="text-[10px] font-bold font-manrope uppercase tracking-wider">
                {isSort ? "Newest First" : "Oldest First"}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${isSort ? "rotate-180" : ""}`}
              />
            </button>
            <Popover
              placement="bottomRight"
              trigger="click"
              overlayClassName="premium-popover"
              content={<div className="w-48 p-2">Filters...</div>}
            >
              <button 
                aria-label="Filter unassigned items"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#064e3b]/5 text-[#064e3b]/80 hover:text-[#064e3b]"
              >
                <ListFilter size={16} />
              </button>
            </Popover>
          </div>

          {sortedIssues.length !== 0 ? (
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <SortableContext items={sortedIssues.map((issue) => issue.id)}>
                <div className="flex flex-col gap-3 pb-4">
                  {[...sortedIssues]
                    .sort((a, b) => {
                      const timeA = new Date(a.created_at).getTime();
                      const timeB = new Date(b.created_at).getTime();
                      return isSort ? timeB - timeA : timeA - timeB;
                    })
                    .map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
              </SortableContext>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-white/40">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#064e3b]/5 text-[#064e3b]/20">
                <ListFilter size={32} />
              </div>
              <h3 className="text-[13px] font-bold text-[#064e3b] font-manrope mb-1 uppercase tracking-tight">
                Inbox Zero!
              </h3>
              <p className="text-[11px] font-medium text-[#064e3b]/70 font-manrope max-w-[180px]">
                Everything is scheduled. Drag items back here to unschedule.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);


export default UnscheduledWork;
