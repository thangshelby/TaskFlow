import { UserStats, ProjectSummary } from "@libs/types/project";
import React, { useMemo } from "react";
import { typeOptions } from "@libs/app/components/general-components/badge/typeBadge";
import { priorityOptions } from "@libs/app/components/general-components/badge/priorityBadge";
import SectionContainer from "./sectionHeader";

interface IssueCount {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const IssueAnalytics = ({ data }: { data: UserStats | ProjectSummary }) => {
  const typeData = useMemo<IssueCount[]>(
    () =>
      data.by_type
        .map((item) => {
          const config = typeOptions.find(
            (opt) => opt.name.toLowerCase() === item.type.toLowerCase(),
          );
          return {
            label: item.type,
            value: item.count,
            icon: config?.icon,
            color: "#064e3b",
          };
        })
        .sort((a, b) => b.value - a.value),
    [data.by_type],
  );

  return (
    <div className="animate-fade-in grid grid-cols-1 gap-8 lg:grid-cols-2 font-manrope">
      {/* Priority Distribution */}
      <SectionContainer
        title="Priority Distribution"
        description="Task urgency breakdown"
        linkText="Analyze"
        href="../list"
      >
        <PriorityChart data={data} />
      </SectionContainer>

      {/* Work Type Distribution */}
      <SectionContainer
        title="Work Type Distribution"
        description="Issue category classification"
        linkText="Analyze"
        href="../list"
      >
        <div className="space-y-6">
          {typeData.map((item, index) => {
            const total = typeData.reduce((sum, d) => sum + d.value, 0);
            const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100);

            // Using premium teal shades for work types instead of random colors
            const barColors = ["#064e3b", "#0f766e", "#14b8a6", "#2dd4bf"];
            const barColor = barColors[index % barColors.length];

            return (
              <div key={index} className="group cursor-default">
                <div className="flex justify-between mb-2 items-center">
                  <div className="flex items-center gap-2.5">
                    {item.icon && <span className="scale-90 origin-left opacity-90">{item.icon}</span>}
                    <span className="text-xs font-bold uppercase tracking-widest text-[#064e3b]">{item.label}S</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#064e3b]">{item.value}</span>
                    <span className="text-[10px] font-bold text-[#404944] opacity-40">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#f3f4f3] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
          {typeData.length === 0 && (
            <div className="py-12 text-center text-xs font-medium text-[#404944] opacity-40 italic">
              No work items categorized yet.
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
};

export default IssueAnalytics;

const PriorityChart = ({ data }: { data: UserStats | ProjectSummary }) => {
  const priorityData: IssueCount[] = useMemo(
    () =>
      data.by_priority
        .map((item) => {
          const config = priorityOptions.find(
            (opt) => opt.name.toLowerCase() === item.priority.toLowerCase(),
          );

          // Use monochromatic teal scale for bars while keeping icons colorful
          let color = "#064e3b";
          const label = item.priority.toLowerCase();
          if (label === "highest") color = "#064e3b"; // Primary
          else if (label === "high") color = "#0f766e"; 
          else if (label === "medium") color = "#14b8a6";
          else if (label === "low") color = "#2dd4bf";
          else if (label === "lowest") color = "#99f6e4";

          return {
            label: item.priority,
            value: item.count,
            color,
            icon: config?.icon,
          };
        })
        .sort((a, b) => {
          const order = ["highest", "high", "medium", "low", "lowest"];
          return order.indexOf(a.label.toLowerCase()) - order.indexOf(b.label.toLowerCase());
        }),
    [data.by_priority],
  );

  const total = priorityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex-1 space-y-6">
      {priorityData.map((item, index) => {
        const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100);
        return (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2.5">
                <span className="scale-90 origin-left opacity-90">{item.icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#064e3b]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#064e3b]">{item.value}</span>
                <span className="text-[10px] font-bold text-[#404944] opacity-40">({percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-[#f3f4f3] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
      {priorityData.length === 0 && (
        <div className="py-12 text-center text-xs font-medium text-[#404944] opacity-40 italic">
          No priority data available.
        </div>
      )}
    </div>
  );
};


