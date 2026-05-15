import { useElasticSearch } from "@libs/apis/elacicSearchApi";
import { Search } from "lucide-react";
import ElacticSearchFilter from "./elacticSearchFilter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TypeBadge from "../badge/typeBadge";
import { IssueType } from "@libs/types/issue";
import { Tooltip } from "antd";
import PriorityBadge from "../badge/priorityBadge";
import UserAvatar from "./userAvatar";
import { ClipLoader } from "react-spinners";
import { IIssue } from "@libs/types/issue";
import StatusBadge from "../badge/statusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";

const filterFormSchema = z.object({
  lastUpdated: z.string().optional(),
  projects: z.array(z.string()),
  assignees: z.array(z.string()),
  reporters: z.array(z.string()),
  statuses: z.array(z.string()),
  labels: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterFormSchema>;

const ElasticSearch = ({ searchQuery }: { searchQuery: string }) => {
  const { register, watch, setValue, reset } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      lastUpdated: "any_time",
      projects: [],
      assignees: [],
      reporters: [],
      statuses: [],
      labels: "",
    },
  });
  const { user } = useAuthStore();
  const { issues, isLoading } = useElasticSearch({
    userId: user?.id || "",
    q: searchQuery,
    last_updated: watch("lastUpdated") || "any_time",
    project_ids: watch("projects") || [],
    assignee_ids: watch("assignees") || [],
    reporter_ids: watch("reporters") || [],
    status: watch("statuses") || [],
  });

  return (
    <div className="flex h-[520px] w-[760px] flex-col rounded-xl bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,53,39,0.15)] overflow-hidden border border-emerald-100/50">
      <div className="flex w-full flex-1 gap-0 overflow-hidden">
        {/* Left Side: Results */}
        <div className="flex w-[62%] flex-col p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <ClipLoader color="#064e3b" size={40} />
              <p className="text-sm font-medium text-emerald-800/40 animate-pulse font-headline uppercase tracking-widest">Searching records...</p>
            </div>
          ) : (
            <RecentItems issues={issues || ([] as IIssue[])} />
          )}
        </div>

        {/* Divider with subtle green gradient */}
        <div className="w-px bg-linear-to-b from-transparent via-emerald-100 to-transparent my-4" />

        {/* Right Side: Filters */}
        <div className="w-[38%] bg-emerald-50/20">
          <ElacticSearchFilter
            register={register}
            watch={watch}
            setValue={setValue}
            reset={reset}
          />
        </div>
      </div>

      {/* Footer: Clean & Professional */}
      <div className="border-t border-emerald-50 bg-white py-1.5 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">
            <span>Quick Links:</span>
            <div className="flex items-center gap-3 text-emerald-900/60">
              <button className="hover:text-emerald-700 transition-all hover:scale-105 active:scale-95 cursor-pointer">Boards</button>
              <button className="hover:text-emerald-700 transition-all hover:scale-105 active:scale-95 cursor-pointer">Projects</button>
              <button className="hover:text-emerald-700 transition-all hover:scale-105 active:scale-95 cursor-pointer">Filters</button>
              <button className="hover:text-emerald-700 transition-all hover:scale-105 active:scale-95 cursor-pointer">People</button>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 transition-all hover:translate-x-1 group cursor-pointer">
            Give feedback
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElasticSearch;

// Component tooltip hiển thị thông tin chi tiết issue
const IssueTooltip = ({ issue }: { issue: IIssue }) => {
  return (
    <div className="w-[260px] rounded-xl border border-emerald-50 bg-white/95 backdrop-blur-xl p-3.5 shadow-2xl ring-1 ring-emerald-900/5">
      {/* Header */}
      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-white shadow-sm border border-emerald-50">
              <TypeBadge type={issue.type as IssueType} isShowLabel={false} />
            </div>
            <span className="font-headline font-black text-emerald-900 tracking-tight text-sm">{issue.key}</span>
          </div>
          <div className="scale-75 origin-right">
            <StatusBadge
              columnId={issue.column_id || ""}
              projectId={issue.project_id}
            />
          </div>
        </div>
        <h4 className="line-clamp-2 text-xs font-bold text-gray-800 leading-tight">
          {issue.summary}
        </h4>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-50/30 border border-emerald-100/50">
          <span className="text-emerald-900/40 font-bold uppercase tracking-widest text-[9px]">Assignee</span>
          <div className="flex items-center gap-2">
            <UserAvatar userId={issue.assignee_id || ""} size={16} isDisplayName={true} />
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-50/30 border border-emerald-100/50">
          <span className="text-emerald-900/40 font-bold uppercase tracking-widest text-[9px]">Priority</span>
          <PriorityBadge priority={issue.priority as any} />
        </div>

        <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-900/5 border border-emerald-900/10 col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-900/40 font-bold uppercase tracking-widest text-[9px]">Story Points</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] shadow-lg shadow-emerald-200">
              {issue.story_point || "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-emerald-50">
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy link
        </button>

        <div className="flex items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity">
          <div className="flex h-4 w-4 items-center justify-center rounded-md bg-primary-container shadow-lg shadow-emerald-200">
            <span className="text-[10px] font-black text-white">T</span>
          </div>
          <span className="text-[10px] font-black text-emerald-900 tracking-tighter uppercase">TaskFlow</span>
        </div>
      </div>
    </div>
  );
};

export const RecentItems = ({ issues }: { issues: IIssue[] }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const handleOpenIssue = (issueId: string) => {
    navigate(`/projects/${projectId}/list?selectedIssue=${issueId}`)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex flex-col gap-1">
          <h3 className="font-headline text-base font-black text-emerald-950 tracking-tight">Work Items</h3>
          <p className="text-[10px] font-medium text-emerald-900/30">Your most relevant tasks</p>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 ">
          <span className="text-xs font-black">{issues.length}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Items</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-3 custom-scrollbar">
        {issues && issues.length > 0 ? (
          issues.slice(0, 15).map((issue: IIssue, index: number) => (
            <Tooltip
              key={index}
              title={<IssueTooltip issue={issue} />}
              placement="right"
              overlayInnerStyle={{ padding: 0, border: "none", background: "transparent", boxShadow: "none" }}
              mouseEnterDelay={0.4}
            >
              <button
                onClick={() => handleOpenIssue(issue.id)}
                className="group flex w-full cursor-pointer items-center gap-2.5 rounded-sm p-1.5 text-left transition-all hover:bg-emerald-50/60 hover:border-emerald-100/50 hover:shadow-sm">
                <div className="shrink-0 group-hover:rotate-6 transition-transform">
                  <TypeBadge type={issue.type as IssueType} isShowLabel={false} />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-emerald-700/60 tracking-widest uppercase">
                      {issue.key}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-emerald-100" />
                    <span className="text-[9px] font-bold text-emerald-900/30 uppercase tracking-tighter">Recent activity</span>
                  </div>
                  <span className="truncate text-xs font-semibold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    {issue.summary}
                  </span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <div className="p-1.5 rounded-full bg-emerald-50 text-emerald-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </Tooltip>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100/50 shadow-inner">
              <Search size={40} className="text-emerald-200" />
            </div>
            <h4 className="text-xl font-black text-emerald-950 mb-2">No items found</h4>
            <p className="text-sm text-emerald-900/40 max-w-[240px] font-medium leading-relaxed">We couldn't find any tasks matching your current search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};



