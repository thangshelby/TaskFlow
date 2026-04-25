import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ProjectSummary } from "@libs/types/project";
import HistorySection from "@libs/app/components/issues/activitySection/history";
import { useParams } from "react-router-dom";
import SectionContainer from "./sectionHeader";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";

interface StatusData {
  label: string;
  value: number;
  color: string;
}

// Atelier Core - Premium palette
const COLOR_PALETTE = [
  "#064e3b", // Deep Teal
  "#0f766e", // Teal-700
  "#0d9488", // Teal-600
  "#14b8a6", // Teal-500
  "#2dd4bf", // Teal-400
  "#5eead4", // Teal-300
  "#99f6e4", // Teal-200
  "#ccfbf1", // Teal-100
];

const StatusOverview = (props: { data: ProjectSummary }) => {
  const { by_status } = props.data;
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const { projectId } = useParams<{ projectId: string }>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const statusData: StatusData[] = by_status.map((status, idx) => ({
    label: status.name,
    value: status.count,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
  }));

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) =>
    total === 0 ? "0.0" : ((value / total) * 100).toFixed(1);

  // Custom premium tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-xl border border-[#e8e8e7] bg-white p-4 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="text-sm font-bold text-[#064e3b]">
              {data.payload.label || label}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#404944] opacity-50">Issues</p>
              <p className="text-sm font-bold text-[#064e3b]">{data.value}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#404944] opacity-50">Share</p>
              <p className="text-sm font-bold text-[#064e3b]">{getPercentage(data.value)}%</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row font-manrope">
      {/* Status Distribution Chart */}
      <SectionContainer
        title="Status distribution"
        description="Current workflow stage distribution"
        linkText="Explore list"
        href="../list"
      >
        <div className="flex flex-col">
          {/* Chart Type Selector */}
          <div className="mb-8 flex justify-end">
            <div className="inline-flex rounded-xl border border-[#e8e8e7] bg-[#f9f9f8] p-1 shadow-sm">
              <button
                onClick={() => setChartType("pie")}
                className={`cursor-pointer rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${chartType === "pie"
                  ? "bg-white text-[#064e3b] shadow-sm ring-1 ring-black/5"
                  : "text-[#404944] opacity-50 hover:opacity-100"
                  }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`cursor-pointer rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${chartType === "bar"
                  ? "bg-white text-[#064e3b] shadow-sm ring-1 ring-black/5"
                  : "text-[#404944] opacity-50 hover:opacity-100"
                  }`}
              >
                Bar
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <ResponsiveContainer width="100%" height={280}>
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={4}
                      cornerRadius={8}
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                      stroke="transparent"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                          style={{
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            filter: activeIndex === index ? "drop-shadow(0 4px 12px rgba(6, 78, 59, 0.2))" : "none"
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart
                    data={statusData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e7" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#404944", opacity: 0.7 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#404944", opacity: 0.7 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                          style={{ transition: "all 0.3s ease" }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
              {/* Total indicator for Pie */}
              {chartType === "pie" && (
                 <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold tracking-tighter text-[#064e3b]">
                      {activeIndex !== null ? statusData[activeIndex].value : total}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#404944] opacity-50">
                       {activeIndex !== null ? statusData[activeIndex].label : "Total Issues"}
                    </p>
                 </div>
              )}
            </div>

            <div className="mt-8 grid w-full grid-cols-2 gap-2">
              {statusData.map((status, index) => (
                <div
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  key={index}
                  className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all duration-300 ${
                    activeIndex === index 
                      ? "bg-[#f0fdf4] border border-[#064e3b]/10" 
                      : "border border-transparent hover:bg-[#f9f9f8]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: status.color, boxShadow: `0 0 8px ${status.color}40` }}
                    />
                    <span className="truncate text-xs font-bold uppercase tracking-wide text-[#064e3b]">
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#064e3b]">
                      {status.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Top Contributors */}
      <SectionContainer
        title="Performance leaderboard"
        description="Most active contributors this week"
        linkText="Full rankings"
        href="#"
      >
        <div className="max-h-120 overflow-y-auto px-1">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e8e8e7]/60 text-[10px] font-bold uppercase tracking-widest text-[#404944] opacity-50">
                <th className="pb-4 px-2">Member</th>
                <th className="pb-4 px-2 text-right">Resolved</th>
                <th className="pb-4 px-2 text-right">Relative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e7]/40">
              {props.data.top_contributors?.map((contributor) => (
                <tr key={contributor.user_id} className="group hover:bg-[#f9f9f8] transition-all duration-300">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        userId={contributor.user_id}
                        size={36}
                        isDisplayName={false}
                        borderRadius="12px"
                        className="shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <span className="text-sm font-bold text-[#064e3b] group-hover:translate-x-1 transition-transform">
                        {contributor.display_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-sm font-bold text-[#064e3b]">
                      {contributor.resolved_count}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="inline-flex items-center rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                      {contributor.contribution_percent.toFixed(0)}%
                    </div>
                  </td>
                </tr>
              ))}
              {(!props.data.top_contributors || props.data.top_contributors.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-xs font-medium text-[#404944] opacity-40 italic">
                    No active contributors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionContainer>

      {/* Recent Activity */}
      <SectionContainer
        title="Pulse feed"
        description="Recent updates and events"
        linkText="View history"
        href="#"
      >
        <div className="max-h-120 overflow-y-auto scrollbar-hide">
          <HistorySection projectId={projectId!} />
        </div>
      </SectionContainer>
    </div>
  );
};

export default StatusOverview;
