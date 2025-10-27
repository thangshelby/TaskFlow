import { useElasticSearch } from "@libs/apis/elacicSearchApi";
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
    <div className="flex h-[600px] w-[800px] flex-col rounded-sm bg-white shadow-md">
      <div className="flex w-full flex-1 gap-4 overflow-hidden">
        <div className="flex w-4/6 flex-col p-4">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <ClipLoader color="#3B82F6" size={32} />
            </div>
          ) : (
            <RecentItems issues={issues || ([] as IIssue[])} />
          )}
        </div>
        {/* Divider */}
        <div className="h-full w-1 border-l border-gray-400" />

        <ElacticSearchFilter
          register={register}
          watch={watch}
          setValue={setValue}
          reset={reset}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-400 py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span>Go to all:</span>
              <button className="hover:text-foreground transition-colors">
                Boards
              </button>
              <button className="hover:text-foreground transition-colors">
                Projects
              </button>
              <button className="hover:text-foreground transition-colors">
                Filters
              </button>
              <button className="hover:text-foreground transition-colors">
                People
              </button>
            </div>
            <button className="text-sm text-blue-600 transition-colors hover:text-blue-700">
              Give feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElasticSearch;

// Component tooltip hiển thị thông tin chi tiết issue
const IssueTooltip = ({ issue }: { issue: IIssue }) => {
  return (
    <div className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="mb-3">
        <div className="mb-2 flex items-center gap-2">
          <TypeBadge type={issue.type as IssueType} isShowLabel={false} />
          <span className="font-semibold text-gray-900">{issue.key}</span>
        </div>
        <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
          {issue.summary}
        </h4>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Assignee:</span>
          <UserAvatar
            userId={issue.assignee_id || ""}
            size={24}
            isDisplayName={false}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status:</span>
          <StatusBadge
            columnId={issue.column_id || ""}
            projectId={issue.project_id}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Priority:</span>
          <PriorityBadge
            priority={
              issue.priority as "Lowest" | "Low" | "Medium" | "High" | "Highest"
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Story Points:</span>
          <span className="text-gray-700">
            {issue.story_point || "Not set"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3 text-xs">
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
              />
            </svg>
            Copy link
          </button>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            View related links
          </button>
        </div>
      </div>

      {/* Application indicator */}
      <div className="mt-2 flex items-center justify-end">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="flex h-3 w-3 items-center justify-center rounded-sm bg-blue-500">
            <span className="text-xs font-bold text-white">T</span>
          </div>
          TaskFlow
        </div>
      </div>
    </div>
  );
};

export const RecentItems = ({ issues }: { issues: IIssue[] }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <h3 className="text-foreground text-sm font-semibold">Work Items</h3>
        <p className="rounded-sm bg-gray-100 px-2 py-0.5 text-sm font-bold text-gray-700">
          {issues.length}
        </p>
      </div>
      <div className="space-y-1">
        {issues.slice(0, 10).map((issue: IIssue, index: number) => (
          <Tooltip
            key={index}
            title={<IssueTooltip issue={issue} />}
            placement="right"
            overlayInnerStyle={{ padding: 0, maxWidth: "320px" }}
          >
            <button className="text-foreground hover:bg-muted flex w-full cursor-pointer items-center gap-1 rounded-sm py-1 text-left text-sm transition-colors hover:bg-gray-100">
              <TypeBadge type={issue.type as IssueType} isShowLabel={false} />
              <span className="truncate text-xs font-semibold text-gray-900">
                {issue.key}
              </span>

              <span className="text-muted-foreground truncate">
                {issue.summary}
              </span>
            </button>
          </Tooltip>
        ))}
      </div>
      <button
        onClick={() => navigate(`/projects/${projectId}/list`)}
        className="mt-4 cursor-pointer text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
      >
        Show more
      </button>
    </div>
  );
};
