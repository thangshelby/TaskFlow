import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Settings2, CalendarPlus } from "lucide-react";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";

const RoadmapFilter = ({
  initialFilters,
  setSearchParams,
  handleToggleUnscheduledWork,
  currentDate,
  goToToday,
  previousMonth,
  nextMonth,
}: {
  initialFilters: GetIssuesParams;
  setSearchParams: (params: any) => void;
  handleToggleUnscheduledWork: () => void;
  currentDate: Date;
  goToToday: () => void;
  previousMonth: () => void;
  nextMonth: () => void;
}) => {
  const formatMonth = (date: Date): string => {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-[#064e3b] font-manrope uppercase">Roadmap</h1>
        <p className="text-[12px] text-[#404944]/60 font-manrope font-medium tracking-wide">Plan and visualize your project timeline and milestones</p>
      </div>
      <div className="flex items-center justify-between py-1">

        {/* Left side - Filters */}
        <div className="flex items-center gap-4">
          <PageFilter
            initialFilters={initialFilters}
            onFiltersChange={setSearchParams}
          />
        </div>

        {/* Right side - Calendar Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="h-10 px-4 rounded-xl border border-[#e8e8e7] bg-white text-[11px] font-bold uppercase tracking-widest text-[#064e3b] transition-all hover:bg-[#f9f9f8] hover:border-[#064e3b]/30 font-manrope shadow-button"
          >
            Today
          </button>

          <div className="flex items-center h-10 rounded-xl border border-[#e8e8e7] bg-white overflow-hidden shadow-button">
            <button
              onClick={previousMonth}
              className="h-full px-3 flex items-center justify-center text-[#064e3b]/60 hover:bg-[#f9f9f8] hover:text-[#064e3b] transition-all"
            >
              <FaChevronLeft size={10} />
            </button>

            <div className="w-px h-4 bg-[#e8e8e7]" />

            <span className="px-5 text-[11px] font-bold uppercase tracking-widest text-[#064e3b] font-manrope">
              {formatMonth(currentDate)}
            </span>

            <div className="w-px h-4 bg-[#e8e8e7]" />

            <button
              onClick={nextMonth}
              className="h-full px-3 flex items-center justify-center text-[#064e3b]/60 hover:bg-[#f9f9f8] hover:text-[#064e3b] transition-all"
            >
              <FaChevronRight size={10} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleUnscheduledWork}
              title="Toggle Unscheduled Work"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8e8e7] bg-white text-[#064e3b]/60 hover:text-[#064e3b] hover:bg-[#f9f9f8] transition-all shadow-button"
            >
              <CalendarPlus size={18} />
            </button>
            <button
              title="Roadmap Settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8e8e7] bg-white text-[#064e3b]/60 hover:text-[#064e3b] hover:bg-[#f9f9f8] transition-all shadow-button"
            >
              <Settings2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RoadmapFilter;
