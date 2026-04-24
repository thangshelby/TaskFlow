import React, { useState, lazy, Suspense, useTransition, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Button from "@libs/app/components/general-components/button";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams, IIssue } from "@libs/types/issue";
import BacklogSkeleton from "@libs/app/components/skeleton/backlogSkeleton";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { BacklogProvider } from "@libs/app/context/backlog.context";
const BacklogEpic = lazy(
  () => import("@libs/app/components/projects/backlog/backlogEpic"),
);
import IssueDetail from "@libs/app/components/issues/IssueDetail";
import IssueDetailSkeleton from "@libs/app/components/skeleton/issueDetailSkeleton";
const CreateSprintModal = lazy(
  () => import("@libs/app/components/projects/modals/sprint/createSprintModal"),
);
import TypeBadge from "@libs/app/components/general-components/badge/typeBadge";
import { useBackLogPage } from "@libs/hooks/pages/useBacklogPage";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumSprint";
import { ISprint } from "@libs/types/sprint";
import { Layers } from "lucide-react";

interface ISprintIssues extends ISprint {
  issues: IIssue[];
}

const BackLogPageContent: React.FC = () => {
  const { projectId = "" } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId,
    limit: 100,
    is_fetch: false,
  });
  const [isEpicVisible, setIsEpicVisible] = useState(false);

  const [_, startTransition] = useTransition();

  const {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    activeIssue,
    isDragging,
    sprintIssues,
    issues,
    isCreateSprintModalOpen,
    setIsCreateSprintModalOpen,
    selectedIssueId,
    sensors,
    isLoadingSprints,
    isLoadingIssues,
  } = useBackLogPage(projectId);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4">
      <Helmet>
        <title>Backlog - Task Flow</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-2xl font-bold text-gray-700">Backlog Page</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className={`flex items-center gap-2 font-semibold ${isEpicVisible ? "bg-emerald-100 text-emerald-800" : ""}`}
            onClick={() => setIsEpicVisible(!isEpicVisible)}
          >
            <Layers className="h-4 w-4" />
            Epics
          </Button>
          <Button
            onClick={() => {
              startTransition(() => {
                setIsCreateSprintModalOpen({
                  isOpen: true,
                  sprint: null,
                });
              });
            }}
            variant="primary"
            className="font-semibold"
          >
            Create Sprint
          </Button>
        </div>
      </div>

      <PageFilter
        initialFilters={filters}
        onFiltersChange={(filter) => {
          setFilters(filter as GetIssuesParams);
        }}
      />
      {isLoadingSprints || isLoadingIssues ? (
        <BacklogSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 gap-4 overflow-auto">
            <SortableContext
              items={sprintIssues
                .map((sprint) => sprint.id)
                .concat(
                  issues
                    .filter((issue) => ["epic", "Epic  "].includes(issue.type))
                    .map((issue) => issue.id),
                )
                .concat("no-epic")}
            >
              <PanelGroup
                className="flex w-full flex-1"
                autoSaveId="backlog-panel-group"
                direction="horizontal"
              >
                {isEpicVisible && (
                  <>
                    <Panel
                      id="epic-panel"
                      order={0}
                      defaultSize={22}
                      minSize={16}
                      maxSize={35}
                    >
                      <div className="h-full overflow-y-auto">
                        <Suspense fallback={<div className="p-4 text-sm text-gray-400">Loading Epics...</div>}>
                          <BacklogEpic issues={issues} />
                        </Suspense>
                      </div>
                    </Panel>
                    <PanelResizeHandle
                      className="relative w-[2px] cursor-col-resize bg-gray-200 hover:bg-emerald-400 transition-colors"
                    />
                  </>
                )}

                <Panel
                  id="backlog-panel"
                  order={1}
                  defaultSize={selectedIssueId ? 60 : 100}
                  minSize={40}
                  maxSize={100}
                >
                  <div className="h-full overflow-auto pr-4">
                    <ul className="flex min-w-[800px] flex-col gap-2">
                      {sprintIssues?.map((sprint: ISprintIssues) => (
                        <div key={sprint.id}>
                          <ScrumSprint
                            sprint={sprint}
                            projectId={projectId}
                            isDragging={isDragging}
                            setIsCreateSprintModalOpen={(data: {
                              isOpen: boolean;
                              sprint?: ISprintIssues | ISprint | null;
                            }) => {
                              setIsCreateSprintModalOpen(
                                data as {
                                  isOpen: boolean;
                                  sprint: ISprint | null;
                                },
                              );
                            }}
                          />
                        </div>
                      ))}
                    </ul>
                  </div>
                </Panel>

                {selectedIssueId && (
                  <>
                    <PanelResizeHandle
                      style={{
                        backgroundColor: "oklch(0.696 0.17 162.48)",
                      }}
                      className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
                    />
                    <Panel
                      id="issue-side-bar-panel"
                      order={2}
                      defaultSize={40}
                      maxSize={50}
                      minSize={30}
                    >
                      <div className="h-full overflow-y-auto pr-4">
                        <Suspense fallback={<IssueDetailSkeleton />}>
                          <IssueDetail selectedIssueId={selectedIssueId} />
                        </Suspense>
                      </div>
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </SortableContext>
            <DragOverlay>
              {activeIssue && (
                <div className="inline-block rounded-md border border-gray-500 shadow-2xl">
                  <div className="flex flex-row items-center gap-3 rounded-md bg-white px-2 py-1 opacity-70">
                    <div className="flex flex-row items-center gap-1">
                      <TypeBadge isShowLabel={false} type={activeIssue.type} />
                      <span className="text-xs">{activeIssue.key}</span>
                    </div>
                    <span className="text-xs">{activeIssue.summary}</span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </div>
        </DndContext>
      )}

      {/* Create Sprint Modal */}
      {isCreateSprintModalOpen.isOpen && (
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen.isOpen}
          isEditing={isCreateSprintModalOpen.sprint ? true : false}
          onClose={() => {
            startTransition(() => {
              setIsCreateSprintModalOpen({
                isOpen: false,
                sprint: null,
              });
            });
          }}
          projectId={projectId}
          initialSprint={isCreateSprintModalOpen.sprint}
        />
      )}
    </div>
  );
};

const BackLogPage: React.FC = () => {
  return (
    <BacklogProvider>
      <BackLogPageContent />
    </BacklogProvider>
  );
};

export default BackLogPage;
