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
import { UserStats } from "@libs/types/project";
import HistorySection from "@libs/app/components/issues/activitySection/history";
import { useParams } from "react-router-dom";
import SectionContainer from "./sectionHeader";
interface StatusData {
  label: string;
  value: number;
  color: string;
}

// Jira-inspired color palette
const COLOR_PALETTE = [
  "#0052CC", // Jira Blue
  "#36B37E", // Jira Green
  "#FFAB00", // Jira Yellow
  "#DE350B", // Jira Red
  "#6554C0", // Jira Purple
  "#006644", // Jira Teal
  "#FF5630", // Jira Orange
  "#253858", // Jira Dark Blue
];

const StatusOverview = (props: { data: UserStats }) => {
  const { by_status } = props.data;
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const { projectId } = useParams<{ projectId: string }>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const statusData: StatusData[] = by_status.map((status, idx) => ({
    label: status.name,
    value: status.count,
    color: COLOR_PALETTE[idx] || "#94a3b8",
  }));

  const total = statusData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) =>
    total === 0 ? "0.0" : ((value / total) * 100).toFixed(1);

  // Jira-style tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="cursor-pointer rounded-md border border-gray-300 bg-white p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div
              className="h-3 w-3"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="font-medium text-gray-900">
              {data.payload.label || label}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Issues:</span>{" "}
              <span className="font-semibold text-gray-900">{data.value}</span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Percentage:</span>{" "}
              <span className="font-semibold text-gray-900">
                {getPercentage(data.value)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Hide labels for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Status Distribution Chart - Jira Style */}
      {/* Header with Jira-style styling */}
      <SectionContainer
        title="Status overview"
        description="Get a snapshot of the status of your work items"
        linkText="View all work items"
        href="../list"
      >
        {" "}
        <div className="p-6">
          {/* Chart Type Selector - Jira Style */}
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-900">
              Status Distribution
            </h4>
            <div className="flex rounded-md border border-gray-300 bg-white p-1">
              <button
                onClick={() => setChartType("pie")}
                className={`cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                  chartType === "pie"
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                  chartType === "bar"
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          {/* Chart Container - Jira Style */}
          <div className="flex flex-row items-center justify-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={260}>
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={0.5}
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                      stroke="#fff"
                      strokeWidth={1}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          transform={
                            activeIndex === index ? "scale(1.05)" : "scale(1)"
                          }
                          style={{
                            transition:
                              "transform 0.4s ease-in-out, opacity 0.3s ease",
                            transformOrigin: "center",
                            transformBox: "fill-box",
                            opacity:
                              activeIndex === null
                                ? 1
                                : activeIndex === index
                                  ? 1
                                  : 0.3,
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Pie>

                    {/* Hiển thị tổng số ở giữa biểu đồ (Jira style) */}
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-900 text-2xl font-semibold"
                    >
                      {activeIndex !== null
                        ? (
                            (statusData[activeIndex].value / total) *
                            100
                          ).toFixed(1)
                        : total}
                      %
                    </text>
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-gray-500 text-sm"
                    >
                      {activeIndex !== null
                        ? statusData[activeIndex].label
                        : "Total work items"}
                    </text>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart
                    data={statusData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="flex w-auto flex-col gap-3">
              {statusData.map((status, index) => (
                <div
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  key={index}
                  className={`flex cursor-pointer items-center space-x-2 p-2 ${
                    activeIndex === index ? "bg-gray-100" : ""
                  }`}
                >
                  <div
                    className="h-3 w-3 flex-shrink-0"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {status.label.toUpperCase()}: {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Activity Feed - Jira Style */}
      {/* Header with Jira-style styling */}
      <SectionContainer
        title="Recent activity"
        description="Stay up to date with what's happening across the space."
        linkText="View all activity"
        href="#"
      >
        <div className="max-h-80 overflow-scroll">
          <HistorySection projectId={projectId!} />
        </div>
      </SectionContainer>
    </div>
  );
};

export default StatusOverview;
