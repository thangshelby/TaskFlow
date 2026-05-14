import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { Popover, Tooltip } from "antd";
import { LuTableProperties, LuTable } from "react-icons/lu";
import { exportCSV, exportExcel } from "@libs/utils/file";
import { IIssue } from "@libs/types/issue";
import { GetIssuesParams } from "@libs/types/issue";
import PageFilter from "@libs/app/components/general-components/pageFilter";

const items = [
  { key: "export_csv", label: "Export CSV (all fields)" },
  { key: "export_excel", label: "Export Excel (all fields)" },
];

interface ListPageHeaderProps {
  issues: IIssue[];
  filters: GetIssuesParams;
  setFilter: (filter: GetIssuesParams) => void;
  listMode: "list" | "detail";
  setListMode: (mode: "list" | "detail") => void;
}

const ListPageHeader = ({
  filters,
  setFilter,
  issues,
  listMode,
  setListMode,
}: ListPageHeaderProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [, startTransition] = useTransition();
  const handleExport = (key: string) => {
    switch (key) {
      case "export_csv":
        exportCSV(issues || []);
        break;
      case "export_excel":
        exportExcel(issues || []);
        break;
      default:
    }
    setIsPopoverOpen(false);
  };

  return (
    <div className="mb-4 flex items-center justify-between font-manrope">
      <PageFilter
        initialFilters={filters}
        onFiltersChange={(filter) => {
          setFilter(filter as GetIssuesParams);
        }}
      />

      <div className="flex items-center gap-4 pr-4">
        <Popover
          content={
            <div className="flex flex-col rounded-xl bg-white py-2 shadow-xl border border-[#e8e8e7]">
              {items.map((item) => (
                <span
                  key={item.key}
                  onClick={() => handleExport(item.key)}
                  className="cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#404944] hover:bg-[#f9f9f8] hover:text-[#064e3b] transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </div>
          }
          placement="bottomLeft"
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={(bool) => setIsPopoverOpen(bool)}
        >
          <button
            className={`cursor-pointer rounded-xl border p-2.5 transition-all duration-300 shadow-sm flex items-center justify-center ${
              isPopoverOpen 
                ? "border-[#064e3b] bg-[#f0fdf4]" 
                : "border-[#e8e8e7] bg-white hover:border-[#064e3b]/30 hover:bg-[#f9f9f8]"
            }`}
          >
            <Upload
              className={`transition-colors ${
                isPopoverOpen ? "text-[#064e3b]" : "text-[#404944]"
              }`}
              size={18}
            />
          </button>
        </Popover>

        <div className="flex items-center gap-2 p-1 bg-[#f9f9f8] border border-[#e8e8e7] rounded-xl shadow-inner">
          <Tooltip title={<span className="text-[10px] font-bold uppercase tracking-widest">List Table</span>}>
            <button
              className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-300 flex items-center justify-center ${
                listMode === "list" 
                  ? "bg-white text-[#064e3b] shadow-sm ring-1 ring-black/5" 
                  : "text-[#404944] opacity-50 hover:opacity-100"
              }`}
              onClick={() => {
                startTransition(() => {
                  setListMode("list");
                  setFilter({
                    ...filters,
                    parent_ids: ["NULL"],
                  });
                });
              }}
            >
              <LuTable size={18} />
            </button>
          </Tooltip>

          <Tooltip title={<span className="text-[10px] font-bold uppercase tracking-widest">Detail View</span>}>
            <button
              className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all duration-300 flex items-center justify-center ${
                listMode === "detail" 
                  ? "bg-white text-[#064e3b] shadow-sm ring-1 ring-black/5" 
                  : "text-[#404944] opacity-50 hover:opacity-100"
              }`}
              onClick={() => {
                startTransition(() => {
                  setListMode("detail");
                  setFilter({
                    ...filters,
                    parent_ids: [],
                  });
                });
              }}
            >
              <LuTableProperties size={18} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

};

export default ListPageHeader;
