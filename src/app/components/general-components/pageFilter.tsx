import { memo, lazy, useTransition, useEffect, useMemo } from "react";
import Button from "@libs/app/components/general-components/button";
import Popover from "antd/lib/popover";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { GetIssuesParams } from "@libs/types/issue";
import { ListProjectColumnsParams } from "@libs/types/project";
import { get } from "lodash";

const DropdownFilter = lazy(() => import("./dropdownFilter"));

interface PageFilterProps {
  initialFilters?: GetIssuesParams | ListProjectColumnsParams;
  onFiltersChange?: (
    filters: GetIssuesParams | ListProjectColumnsParams,
  ) => void;
}

const PageFilter = memo(
  ({ onFiltersChange, initialFilters }: PageFilterProps) => {
    const initFilters = useMemo(() => {
      return initialFilters || {};
    }, [initialFilters]);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [params] = useSearchParams();
    const [, startTransition] = useTransition();
    const [filters, setFilters] = useState<
      GetIssuesParams | ListProjectColumnsParams
    >(() => initialFilters || {});

    useEffect(() => {
      const urlParams: Record<string, any> = {};

      for (const [key, value] of params.entries()) {
        if (value.includes(",")) {
          urlParams[key] = value.split(",").map((v) => v.trim());
        } else if (value === "true" || value === "false") {
          urlParams[key] = value === "true";
        } else if (!isNaN(Number(value))) {
          urlParams[key] = Number(value);
        } else {
          urlParams[key] = value;
        }
      }

      if (Object.keys(urlParams).length > 0) {
        const newFilters = {
          ...initialFilters,
          ...urlParams,
        };

        setFilters(newFilters);

        if (onFiltersChange) {
          onFiltersChange(newFilters);
        }
      }
    }, []);

    const updateURL = (
      newFilters: GetIssuesParams | ListProjectColumnsParams,
    ) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value &&
          value !== "" &&
          (Array.isArray(value) ? value.length > 0 : true)
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, value.toString());
          }
        }
      });
      if (params.size > 0 && filters !== initFilters) {
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, "", newUrl);
      } else {
        window.history.pushState({}, "", window.location.pathname);
      }
    };

    const handleSaveFilters = () => {
      updateURL(filters);
      setIsPopoverOpen(false);
      onFiltersChange?.(filters);
    };

    const handleClearFilters = () => {
      const clearedFilters: GetIssuesParams = {};
      setFilters(initFilters);
      updateURL(clearedFilters);
    };

    const handleKeywordSearch = (value: string) => {
      const newFilters = { ...filters, keyword: value };
      updateURL(newFilters);
      onFiltersChange?.(newFilters);
    };

    const getActiveFilterCount = () => {
      let count = 0;
      if (filters.keyword) count++;
      if (filters.due_date_from && filters.due_date_to) count++;
      if ((get(filters, "column_ids.length", 0) as number) > 0) count++;
      if (filters.created_at_from && filters.created_at_to) count++;
      if (filters.assignee_ids && filters.assignee_ids.length > 0) count++;
      if (filters.priorities && filters.priorities.length > 0) count++;
      if (filters.types && filters.types.length > 0) count++;
      return count;
    };

    return (
      <div className="space-y-4 font-manrope">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search
              size="middle"
              placeholder="Search issues..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  ...initialFilters,
                  keyword: e.target.value,
                })
              }
              onSearch={handleKeywordSearch}
              allowClear
              className="premium-search rounded-sm"
            />
          </div>

          <Popover
            content={
              <DropdownFilter
                handleClearFilters={handleClearFilters}
                handleSaveFilters={handleSaveFilters}
                setIsPopoverOpen={setIsPopoverOpen}
                filters={filters}
                setFilters={(filters) => {
                  setFilters({ ...initialFilters, ...filters });
                }}
              />
            }
            placement="bottomLeft"
            trigger="click"
            open={isPopoverOpen}
            onOpenChange={() => {
              startTransition(() => {
                setIsPopoverOpen(!isPopoverOpen);
              });
            }}
          >
            <div>
              <Button
                variant={isPopoverOpen || getActiveFilterCount() > 0 ? "primary" : "outline"}
                className={`relative  px-6 transition-all duration-200 shadow-sm hover:shadow-md ${!(isPopoverOpen || getActiveFilterCount() > 0) && "bg-[#f1f5f3] border-[#d1d5d3]"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wider">Filters</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isPopoverOpen ? "rotate-180" : ""}`} />
                </div>
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-bold text-white border-2 border-white shadow-sm animate-scale-in">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </div>
          </Popover>
        </div>
      </div>
    );
  },
);






export default PageFilter;
