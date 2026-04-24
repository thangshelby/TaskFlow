import { UserStats } from "@libs/types/project";
import React, { useMemo, useState } from "react";
import SectionContainer from "./sectionHeader";
import { typeOptions } from "@libs/app/components/general-components/badge/typeBadge";
import { priorityOptions } from "@libs/app/components/general-components/badge/priorityBadge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
interface IssueCount {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const IssueAnalytics = ({ data }: { data: UserStats }) => {
  const typeData = useMemo<IssueCount[]>(
    () =>
      data.by_type
        .map((item) => ({
          label: item.type,
          value: item.count,
          icon: typeOptions.find(
            (option) => option.name.toLowerCase() === item.type.toLowerCase(),
          )?.icon,
        }))
        .sort((a, b) => b.value - a.value),
    [data.by_type],
  );

  const maxTypeValue = Math.max(
    typeData.map((d) => d.value).reduce((a, b) => a + b, 0),
    1,
  );

  return (
    <div className="animate-fade-in grid grid-cols-1 gap-7 lg:grid-cols-2">
      {/* Priority Distribution */}
      <PriorityChart data={data} />

      <SectionContainer
        title="Work Type Breakdown"
        description="Issues categorized by work type"
        linkText="View all issues"
        href="../list"
      >
        <div className="space-y-4">
          {typeData.map((item, index) => (
            <ProgressBar
              key={index}
              item={item}
              maxValue={maxTypeValue}
              category="type"
              icon={item.icon}
            />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default IssueAnalytics;

const ProgressBar = ({
  item,
  maxValue,
  category,
  icon,
}: {
  item: IssueCount;
  maxValue: number;
  category: string;
  icon: React.ReactNode;
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const percentage = (item.value / maxValue) * 100;
  const itemKey = `${category}-${item.label}`;
  const isHovered = hoveredItem === itemKey;

  return (
    <div
      className="group flex cursor-pointer flex-row p-2 transition-all duration-300 ease-out hover:bg-gray-100"
      onMouseEnter={() => setHoveredItem(itemKey)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="flex w-1/6 items-center gap-2">
        {icon}
        <span
          className={`text-sm font-medium transition-all duration-300 ${
            isHovered ? "scale-105 text-gray-900" : "text-gray-600"
          }`}
        >
          {item.label}
        </span>
      </div>
      <div className="relative h-5 w-full flex-1 overflow-hidden bg-gray-300 shadow-inner">
        <div
          className={`absolute top-0 left-0 h-full origin-left transform bg-gray-500 transition-all duration-700 ease-out ${
            isHovered
              ? "shadow-opacity-30 scale-y-110 shadow-lg"
              : "scale-y-100"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
        <div className="absolute top-0 left-5 hidden h-full items-center gap-2 group-hover:block group-hover:scale-105">
          <div className="flex h-full items-center gap-2">
            <span
              className={`text-xs font-semibold transition-all duration-300 ${
                isHovered ? "scale-110 text-gray-900" : "text-gray-900"
              }`}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriorityChart = ({ data }: { data: UserStats }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const priorityData: IssueCount[] = useMemo(
    () =>
      data.by_priority
        .map((item) => {
          const match = priorityOptions.find(
            (opt) => opt.name.toLowerCase() === item.priority.toLowerCase(),
          );
          return {
            label: item.priority,
            value: item.count,
            color: "#6A7280", // fallback màu xanh
            icon: match?.icon, // bạn đã có icon sẵn ở đây
          };
        })
        .sort((a, b) => b.value - a.value),
    [data.by_priority],
  );

  return (
    <SectionContainer
      title="Priority breakdown"
      description="Get a holistic view of how work is being prioritized."
      linkText="How to manage priorities for spaces"
      href="#"
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={priorityData}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }} // tăng bottom cho icon
            barSize={26} // 👈 thu nhỏ width của bar
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#D1D5DB" }}
              tick={({ x, y, payload }) => {
                const current = priorityData.find(
                  (p) => p.label === payload.value,
                );
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    {current?.icon && (
                      <foreignObject
                        x={-36}
                        y={0}
                        width={50}
                        height={50}
                        style={{ overflow: "visible" }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            {current.icon}
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {current.label}
                          </p>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              barSize={40}
            >
              {priorityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || "#3B82F6"}
                  stroke="#ffffff"
                  strokeWidth={1}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    opacity:
                      hoveredIndex === null
                        ? 1
                        : hoveredIndex === index
                          ? 1
                          : 0.4,
                    transform:
                      hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionContainer>
  );
};
