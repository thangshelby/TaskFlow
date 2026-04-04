import { IIssue } from "@libs/types/issue";
import { Suspense, useEffect, useState, useMemo } from "react";
import IssueDetail from "@libs/app/components/issues/IssueDetail";
import IssueDetailSkeleton from "@libs/app/components/skeleton/issueDetailSkeleton";
import IssueCard from "@libs/app/components/projects/roadmap/issueCard";
import {
  ChevronDown,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from "lucide-react";

interface ListDetailProps {
  issues: IIssue[];
  isFetching: boolean;
  maxHeightListTable: number;
}

type SortOption =
  | "created"
  | "key"
  | "last_viewed"
  | "priority"
  | "resolved"
  | "status"
  | "updated";
const ListDetail = ({
  issues,
  isFetching,
  maxHeightListTable,
}: ListDetailProps) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");

  useEffect(() => {
    if (isFetching) return;
    setSelectedIssueId(issues[0].id);
  }, [issues, isFetching]);
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "created", label: "Created" },
    { value: "key", label: "Key" },
    { value: "last_viewed", label: "Last viewed" },
    { value: "priority", label: "Priority" },
    { value: "resolved", label: "Resolved" },
    { value: "status", label: "Status" },
    { value: "updated", label: "Updated" },
  ];

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "key":
          return a.key.localeCompare(b.key);
        case "priority":
          const priorityOrder = {
            Highest: 1,
            High: 2,
            Medium: 3,
            Low: 4,
            Lowest: 5,
          };
          return (
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0)
          );
        case "status":
          return a.column?.name?.localeCompare(b.column?.name || "") || 0;
        case "updated":
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        default:
          return 0;
      }
    });
  }, [issues, sortBy, sortOrder]);
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  return (
    <div
      style={{
        blockSize: maxHeightListTable,
      }}
      className="flex h-full items-start overflow-y-auto pb-6"
    >
      <div className="flex h-full w-1/6 flex-col">
        <div className="flex h-full flex-col bg-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <div className="flex items-center justify-between space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className={`flex cursor-pointer items-center space-x-2 rounded-md border px-2 py-1 transition-colors ${isSortDropdownOpen ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-transparent text-gray-500"}`}
                >
                  <span className="font-medium">
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        Order work items by
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {sortOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="sort"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={() => {
                              handleSort(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter and Refresh Icons */}
              <button
                onClick={() => handleSort(sortBy)}
                className="cursor-pointer rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                {sortOrder === "asc" ? (
                  <ArrowUpNarrowWide className="h-5 w-5" />
                ) : (
                  <ArrowDownNarrowWide className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Issues List */}
          <div
            className="flex-1 overflow-y-auto pr-1"
            style={{ blockSize: maxHeightListTable - 120 }}
          >
            {isFetching ? (
              <div className="space-y-3 p-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-3 rounded-md border border-gray-200 p-3">
                      <div className="h-4 w-4 rounded bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-3 w-1/4 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 px-1 pb-2">
                {sortedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="cursor-pointer"
                  >
                    <IssueCard
                      issue={issue}
                      isActive={selectedIssueId === issue.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-gray-500">
              {issues.length} of {issues.length}
            </div>
          </div>
        </div>
      </div>

      {/* Issue Detail */}
      <div className="h-full flex-1 overflow-y-scroll">
        <Suspense fallback={<IssueDetailSkeleton />}>
          <IssueDetail selectedIssueId={selectedIssueId || ""} />
        </Suspense>
      </div>
    </div>
  );
};

export default ListDetail;
