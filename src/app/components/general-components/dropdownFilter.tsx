import Button from "@libs/app/components/general-components/button";
import { DatePicker, Checkbox } from "antd";

import dayjs from "dayjs";

import StatusBadge from "@libs/app/components/general-components/badge/statusBadge";
import TypeBadge, {
  typeOptions,
} from "@libs/app/components/general-components/badge/typeBadge";
import PriorityBadge, {
  priorityOptions,
} from "@libs/app/components/general-components/badge/priorityBadge";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
const { RangePicker } = DatePicker;
import { useParams } from "react-router-dom";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";

import { useProjectColumns } from "@libs/hooks/apis/useProject";

const DropdownFilter = ({
  handleClearFilters,
  handleSaveFilters,
  setIsPopoverOpen,
  filters,
  setFilters,
}: {
  handleClearFilters: () => void;
  handleSaveFilters: () => void;
  setIsPopoverOpen: (isOpen: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projectMembers } = useProjectMembers({
    project_id: projectId as string,
  });
  const { columns } = useProjectColumns({ project_id: projectId as string });
  return (
    <div className="w-[520px] rounded-xl bg-white shadow-2xl font-manrope overflow-hidden border border-[#e8e8e7]">
      <div className="flex items-center justify-between bg-[#f9f9f8] px-5 py-4 border-b border-[#e8e8e7]">
        <span className="text-[11px] font-bold text-[#064e3b] uppercase tracking-[0.2em]">FILTERS</span>
        <button
          onClick={handleClearFilters}
          className="text-xs font-bold text-[#059669] hover:text-[#064e3b] hover:underline transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex max-h-[500px] flex-col gap-6 overflow-y-auto px-5 py-6 custom-scrollbar">
        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Due date range</p>
          <RangePicker
            className="w-full premium-datepicker"
            separator={<span className="text-[#064e3b]/30">→</span>}
            value={
              filters.due_date_from && filters.due_date_to
                ? [dayjs(filters.due_date_from), dayjs(filters.due_date_to)]
                : null
            }
            onChange={(dates) => {
              setFilters({
                ...filters,
                due_date_from: dates?.[0]?.format("YYYY-MM-DD"),
                due_date_to: dates?.[1]?.format("YYYY-MM-DD"),
              });
            }}
            placeholder={["START DATE", "END DATE"]}
            style={{
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #e8e8e7",
              fontFamily: "Manrope, sans-serif"
            }}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Filter by Status</p>
          <div className="flex flex-wrap gap-2.5">
            {columns.map((column) => (
              <div
                onClick={() => {
                  const currentIds = filters.column_ids;
                  if (currentIds?.includes(column.id)) {
                    setFilters({
                      ...filters,
                      column_ids: currentIds.filter(
                        (id: string) => id !== column.id,
                      ),
                    });
                  } else {
                    setFilters({
                      ...filters,
                      column_ids: [...(currentIds || []), column.id],
                    });
                  }
                }}
                key={column.id}
                className={`flex items-center cursor-pointer rounded-2xl transition-all duration-200 border-2 ${
                  filters?.column_ids?.includes(column.id) 
                  ? "border-[#064e3b] scale-105 shadow-sm" 
                  : "border-transparent hover:scale-105"
                }`}
              >
                <StatusBadge column={column} />
              </div>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Priority Level</p>
          <div className="flex flex-row items-center gap-3">
            {priorityOptions.map((priority) => (
              <div
                onClick={() => {
                  const currentIds = filters.priorities || [];
                  const newIds = currentIds.includes(priority.name)
                    ? currentIds.filter((id: string) => id !== priority.name)
                    : [...currentIds, priority.name];
                  setFilters({ ...filters, priorities: newIds });
                }}
                key={priority.name}
                className={`flex items-center cursor-pointer rounded-2xl transition-all duration-200 border-2 ${
                  filters?.priorities?.includes(priority.name) 
                  ? "border-[#064e3b] scale-110 shadow-sm" 
                  : "border-transparent hover:scale-110"
                }`}
              >
                <PriorityBadge priority={priority.name} isShowLabel={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Created at */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Creation Period</p>
          <RangePicker
            className="w-full premium-datepicker"
            separator={<span className="text-[#064e3b]/30">→</span>}
            value={
              filters.created_at_from && filters.created_at_to
                ? [dayjs(filters.created_at_from), dayjs(filters.created_at_to)]
                : null
            }
            onChange={(dates) => {
              setFilters({
                ...filters,
                created_at_from: dates?.[0]?.format("YYYY-MM-DD"),
                created_at_to: dates?.[1]?.format("YYYY-MM-DD"),
              });
            }}
            placeholder={["START DATE", "END DATE"]}
            style={{
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #e8e8e7",
              fontFamily: "Manrope, sans-serif"
            }}
          />
        </div>

        {/* Work Type */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Work Category</p>
          <div className="flex flex-row flex-wrap gap-4">
            {typeOptions.map((workType) => (
              <div 
                key={workType.id} 
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => {
                  const currentIds = filters.types || [];
                  const newIds = currentIds.includes(workType.id)
                    ? currentIds.filter((id: string) => id !== workType.id)
                    : [...currentIds, workType.id];
                  setFilters({ ...filters, types: newIds });
                }}
              >
                <Checkbox
                  checked={filters.types?.includes(workType.id)}
                  className="premium-checkbox"
                />
                <TypeBadge type={workType.id} />
              </div>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/60">Assigned To</p>
          <div className="flex flex-row flex-wrap gap-3">
            {projectMembers?.map((assignee) => (
              <div
                key={assignee.id}
                onClick={() => {
                  const currentIds = filters.assignee_ids || [];
                  const newIds = currentIds.includes(assignee.id)
                    ? currentIds.filter((id: string) => id !== assignee.id)
                    : [...currentIds, assignee.id];
                  setFilters({ ...filters, assignee_ids: newIds });
                }}
                className={`flex items-center cursor-pointer rounded-full transition-all duration-200 border-2 ${
                  filters?.assignee_ids?.includes(assignee.id) 
                  ? "border-[#064e3b] scale-110 shadow-md" 
                  : "border-transparent hover:scale-110"
                }`}
              >
                <UserAvatar
                  size={36}
                  isDisplayName={false}
                  userId={assignee.user_id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 bg-[#f9f9f8] border-t border-[#e8e8e7] px-5 py-4">
        <Button
          onClick={() => setIsPopoverOpen(false)}
          className="bg-white text-[#064e3b] border border-[#e8e8e7] hover:bg-gray-50 px-6 h-[36px] text-[12px] font-bold uppercase tracking-wider"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveFilters}
          className="bg-[#064e3b] text-white hover:bg-[#059669] shadow-md px-8 h-[36px] text-[12px] font-bold uppercase tracking-wider"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DropdownFilter;
