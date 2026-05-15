import KanbanBoard from "@libs/app/components/projects/board/kanbanBoard";
import React, { lazy, useRef, useState, useTransition } from "react";
import { Helmet } from "react-helmet-async";
import KanbanBoardSkeleton from "@libs/app/components/skeleton/kanbanBoardSkeleton";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { RefreshCcw, Settings } from "lucide-react";
import { ListProjectColumnsParams } from "@libs/types/project";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import { FaChartLine } from "react-icons/fa";
import { BoardContextProvider } from "@libs/app/context/board.context";
import Button from "@libs/app/components/general-components/button";

const SprintInsight = lazy(
  () => import("@libs/app/components/projects/board/spintInsight"),
);
const ViewSettingsTooltip = lazy(
  () => import("@libs/app/components/projects/board/viewSettingsTooltip"),
);

import { useParams } from "react-router-dom";

const IssueDetailModal = lazy(
  () => import("@libs/app/components/projects/modals/issue/issueDetailModal"),
);
const BoardPage: React.FC = () => {
  const { projectId } = useParams();
  const [isViewSettingsOpen, setIsViewSettingsOpen] = useState(false);
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const [filter, setFilter] = useState<ListProjectColumnsParams>({
    project_id: projectId || "",
    active_sprint_only: true,
  });
  const { columns: initialColumns, isLoading: isLoadingColumns } =
    useProjectColumns(filter);

  const [_, startTransition] = useTransition();
  return (
    <BoardContextProvider>
      <div className="h-full">
        <Helmet>
          <title>Board - Task Flow</title>
        </Helmet>
        <div className="flex h-full flex-col gap-4">
          <h1 className="p-2 text-2xl font-bold text-gray-700">Kanban Board</h1>
          <div className="flex items-center justify-between">
            <PageFilter
              initialFilters={filter}
              onFiltersChange={(filters) => {
                setFilter({
                  ...filters,
                  project_id: filter.project_id,
                } as ListProjectColumnsParams);
              }}
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={() => { }}
                type="button"
                title="Complete sprint"
                variant="primary"
                className=""
                size="md"
              >
                <span>Complete sprint</span>
              </Button>

              <div className="h-6 w-px bg-[#e8e8e7] mx-1" />

              <Button
                type="button"
                title="Refresh"
                variant="outline"
                className="p-2"
              >
                <RefreshCcw size={18} />
              </Button>

              <Button
                title="Sprint Detail"
                type="button"
                variant="outline"
                className="p-2"
                onClick={() =>
                  startTransition(() => {
                    setIsInsightOpen(true);
                  })
                }
              >
                <FaChartLine size={18} />
              </Button>

              <div className="relative">
                <Button
                  title="View Settings"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    startTransition(() => {
                      setIsViewSettingsOpen(!isViewSettingsOpen);
                    })
                  }
                  className="p-2"
                >
                  <Settings size={18} />
                </Button>

                {/* View Settings Tooltip */}
                <ViewSettingsTooltip
                  isOpen={isViewSettingsOpen}
                  onClose={() => setIsViewSettingsOpen(false)}
                  triggerRef={settingsButtonRef}
                />
              </div>
            </div>
          </div>
          {isLoadingColumns || initialColumns.length === 0 ? (
            <KanbanBoardSkeleton />
          ) : (
            <KanbanBoard initialColumns={initialColumns} />
          )}
          {isInsightOpen && (
            <SprintInsight onClose={() => setIsInsightOpen(false)} />
          )}
        </div>
        <IssueDetailModal />
        {/* <CompleteSprintModal
        isOpen={isCompleteSprintModalOpen}
        onClose={() => setIsCompleteSprintModalOpen(false)}
          projectId={projectId || ""}
          sprint={null as ISprint & { issues?: IIssue[] }}
        /> */}
      </div>
    </BoardContextProvider>
  );
};

export default BoardPage;
