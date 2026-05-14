import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { LuBookmark, LuBug, LuClipboardCheck, LuStar } from "react-icons/lu";
import { CiAt } from "react-icons/ci";
import {
  MdOutlineBedroomParent,
  // MdLabelImportantOutline,
  MdOutlineSubtitles,
  MdOutlineSummarize,
  MdOutlineDescription,
} from "react-icons/md";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { IIssue } from "@libs/types/issue";
import { RiTeamFill } from "react-icons/ri";
import { IoIosPrint } from "react-icons/io";
import { LuCircleArrowRight } from "react-icons/lu";
import { CiCircleChevUp } from "react-icons/ci";

export type ITableColumn = keyof Omit<IIssue, "title" | "children">;

export const columnsIcon: Record<ITableColumn, React.ReactNode> = {
  id: <FaPlus />,
  project_id: <FaPlus />,
  key: <MdOutlineSubtitles />,
  summary: <MdOutlineSummarize />,
  description: <MdOutlineDescription />,
  column: <LuCircleArrowRight />,
  priority: <CiCircleChevUp />,
  type: <div />,
  sprint_id: <IoIosPrint />,
  assignee_id: <CiAt />,
  reporter_id: <CiAt />,
  parent_id: <MdOutlineBedroomParent />,
  story_point: <MdOutlineSummarize />,
  attachments: <FaPlus />,
  created_at: <FaCalendarAlt />,
  updated_at: <FaCalendarAlt />,
  due_date_from: <FaCalendarAlt />,
  due_date_to: <FaCalendarAlt />,
  completed_at: <FaCalendarAlt />,
  team_id: <RiTeamFill />,
  column_id: <LuCircleArrowRight />,
};


export const typeOptions = [
  {
    id: "Bug",
    name: "Bug",
    icon: <LuBug className="h-4 w-4 text-[#991b1b]" />,
    bgColor: "bg-[#fef2f2]",
    textColor: "text-[#991b1b]",
  },
  {
    id: "Task",
    name: "Task",
    icon: <LuClipboardCheck className="h-4 w-4 text-[#064e3b]" />,
    bgColor: "bg-[#f0fdf4]",
    textColor: "text-[#064e3b]",
  },
  {
    id: "Story",
    name: "Story",
    icon: <LuBookmark className="h-4 w-4 text-[#059669]" />,
    bgColor: "bg-[#ecfdf5]",
    textColor: "text-[#059669]",
  },
  {
    id: "Epic",
    name: "Epic",
    icon: <LuStar className="h-4 w-4 text-[#5b21b6]" />,
    bgColor: "bg-[#f5f3ff]",
    textColor: "text-[#5b21b6]",
  },
];


export const priorityOptions = [
  { name: "High", icon: <FcHighPriority size={20} /> },
  { name: "Medium", icon: <FcMediumPriority size={20} /> },
  { name: "Low", icon: <FcLowPriority size={20} /> },
];

export const statusOptions = [
  {
    label: "TO DO",
    key: "TO DO",
    order: 1,
    textColor: "text-gray-600",
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-600",
    dotColor: "bg-blue-400",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-600",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100",
  },
];
