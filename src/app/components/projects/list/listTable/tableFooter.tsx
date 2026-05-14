import React from "react";
import { FaPlus } from "react-icons/fa";
import { RotateCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface TableFooterProps {
  selectedRowKeys: React.Key[];
  onCreateClick: () => void;
  visibleCount: number;
  totalCount: number;
}

const TableFooter = ({
  selectedRowKeys,
  onCreateClick,
  visibleCount,
  totalCount,
}: TableFooterProps) => {
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center justify-between border-t border-[#e8e8e7] bg-[#f9f9f8] p-3 px-6 font-manrope">
      <div className="flex items-center gap-4">
        {selectedRowKeys.length > 0 && (
          <div className="rounded-lg bg-[#064e3b] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ring-1 ring-black/5 animate-in fade-in zoom-in">
            {selectedRowKeys.length} items selected
          </div>
        )}
        <button
          type="button"
          onClick={onCreateClick}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-[#e8e8e7] px-4 py-1.5 text-xs font-bold text-[#064e3b] shadow-sm transition-all duration-300 hover:border-[#064e3b]/30 hover:bg-[#f0fdf4] hover:shadow-md"
        >
          <FaPlus className="h-3 w-3 transition-transform group-hover:rotate-90" />
          <span>New Issue</span>
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#404944] opacity-50">
          Showing <span className="text-[#064e3b]">{visibleCount}</span> of <span className="text-[#064e3b]">{totalCount}</span> issues
        </div>
        <button
          type="button"
          aria-label="Refresh"
          onClick={() =>
            queryClient.invalidateQueries({
              predicate: (q) =>
                Array.isArray(q.queryKey) && q.queryKey[0] === "issues",
            })
          }
          className="group rounded-xl border border-[#e8e8e7] bg-white p-2 text-[#404944] shadow-sm transition-all duration-300 hover:bg-[#f9f9f8] hover:text-[#064e3b]"
        >
          <RotateCw className="h-3.5 w-3.5 transition-transform group-active:rotate-180 duration-500" />
        </button>
      </div>
    </div>
  );
};


export default TableFooter;
