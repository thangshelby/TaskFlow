import { UserStats } from "@libs/types/project";
import React from "react";
import { HiCheck, HiPlus, HiRefresh, HiOutlineCalendar } from "react-icons/hi";
import { motion } from "motion/react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  subLabel: string;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  subLabel,
  highlight,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`flex cursor-pointer items-center gap-4 rounded-xl border border-[#e8e8e7] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group ${
      highlight ? "border-[#064e3b]/20 bg-[#f0fdf4]/30" : ""
    }`}
  >
    {/* Icon container */}
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
        highlight 
          ? "bg-[#064e3b] text-white shadow-lg shadow-[#064e3b]/20" 
          : "bg-[#f3f4f3] text-[#404944] group-hover:bg-[#064e3b] group-hover:text-white"
      }`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[#064e3b]">
            {value}
          </span>
          <span className="text-sm font-semibold text-[#404944] opacity-70 lowercase">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#404944] opacity-50 uppercase tracking-widest">{subLabel}</span>
      </div>
  </motion.div>
);

const MetricCards = ({ data }: { data: UserStats }) => {
  const metrics = [
    {
      label: "completed",
      value: data.by_status[data.by_status.length - 1]?.count || 0,
      icon: <HiCheck size={20} />,
      subLabel: "in the last 7 days",
      highlight: true,
    },
    {
      label: "updated",
      value: data.recently_updated_count || 0,
      icon: <HiRefresh size={20} />,
      subLabel: "in the last 7 days",
    },
    {
      label: "created",
      value: data.new_issues_count || 0,
      icon: <HiPlus size={20} />,
      subLabel: "in the last 7 days",
    },
    {
      label: "due soon",
      value: 0,
      icon: <HiOutlineCalendar size={20} />,
      subLabel: "in the next 7 days",
    },
  ];


  if (!data.by_status.length) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricCards;

