import React, { useState, lazy, Suspense, useTransition, useRef, useEffect } from "react";
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
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";

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
  const [isEpicVisible, setIsEpicVisible] = useState(localStorage.getItem("isEpicVisible") === "true" || false);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "e") {
        handleToggleEpic();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }

  }, [isEpicVisible])

  const handleToggleEpic = () => {
    setIsEpicVisible(!isEpicVisible);
    localStorage.setItem("isEpicVisible", (!isEpicVisible).toString());
  }

  return (
    <div ref={containerRef} className="flex h-full flex-1 min-h-0 flex-col overflow-hidden -m-6 bg-[#fcfcfb]">
      <Helmet>
        <title>Backlog - Task Flow</title>
      </Helmet>
      {isLoadingSprints || isLoadingIssues ? (
        <BacklogSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >

          <div className="flex h-full overflow-hidden">
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
                className="flex w-full"
                autoSaveId="backlog-panel-group"
                direction="horizontal"
              >
                {/* Panel Backlog Section */}
                <Panel
                  id="group-panel"
                  order={0}
                  defaultSize={100}
                  minSize={50}
                  maxSize={100}
                  className="flex flex-col min-w-0"
                >
                  <div className="flex flex-col gap-4 p-6 pb-0">
                    <div className="flex justify-between items-center w-full min-w-0">
                      <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-[#064e3b] font-manrope uppercase tracking-tight">
                          Backlog
                        </h1>
                        <p className="text-[10px] font-black text-[#064e3b]/90 font-manrope uppercase tracking-widest mt-1">
                          {sprintIssues.reduce((acc, s) => acc + (s.issues?.length || 0), 0)} ACTIVE TASKS ACROSS {sprintIssues.length} SPRINTS
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${isEpicVisible ? "bg-[#064e3b]/10 border-[#064e3b] text-[#064e3b]" : ""}`}
                          onClick={handleToggleEpic}
                        >
                          <Layers className="h-4 w-4 mr-2" />
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
                          size="sm"
                        >
                          Create Sprint
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <PageFilter
                        initialFilters={filters}
                        onFiltersChange={(filter) => {
                          setFilters(filter as GetIssuesParams);
                        }}
                      />
                    </div>
                  </div>


                  <div className="flex flex-1 min-h-0 min-w-0 p-6">
                    <PanelGroup
                      autoSaveId="backlog-panel-grouped"
                      className="flex w-full flex-1"
                      direction="horizontal"
                    >
                      {isEpicVisible && (
                        <>
                          <Panel
                            id="epic-panel"
                            order={0}
                            defaultSize={15}
                            minSize={10}
                            maxSize={35}
                          >
                            <div className="h-full overflow-y-auto pr-2">
                              <Suspense fallback={<LoadingFallback fullPage={false} message="Loading Epics..." />}>
                                <BacklogEpic issues={issues}
                                  handleToggleEpic={handleToggleEpic}
                                />
                              </Suspense>
                            </div>
                          </Panel>
                          <PanelResizeHandle
                            className="relative w-[3px] cursor-col-resize bg-[#064e3b]/2 hover:bg-[#064e3b]/10 transition-all mx-1 rounded-full"
                          />
                        </>
                      )}

                      <Panel
                        id="backlog-panel"
                        order={1}
                        defaultSize={selectedIssueId ? 65 : 100}
                        minSize={65}
                        maxSize={100}
                      >
                        <div className="h-full min-w-0 overflow-auto">
                          <ul className="flex min-w-0 flex-col gap-2">
                            {sprintIssues?.map((sprint: ISprintIssues) => (
                              <li list-style="none" key={sprint.id}>
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
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </div>
                </Panel>

                {/* Panel Issue Detail Section */}
                {selectedIssueId && (
                  <>
                    <PanelResizeHandle
                      className="relative w-[3px] cursor-col-resize bg-[#064e3b]/2 hover:bg-[#064e3b]/10 transition-all mx-1 rounded-full"
                    />
                    <Panel
                      id="issue-side-bar-panel"
                      order={1}
                      defaultSize={30}
                      minSize={20}
                      maxSize={50}
                    >
                      <div className="h-full overflow-auto pr-4">
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
                <div className="z-1000 rotate-3 cursor-grabbing">
                  <div className="flex w-[280px] items-center gap-3 rounded-2xl border border-[#064e3b]/20 bg-white p-3 shadow-2xl ring-4 ring-[#064e3b]/5">
                    <div className="flex shrink-0 items-center gap-2">
                      <TypeBadge isShowLabel={false} type={activeIssue.type} />
                      <span className="font-manrope text-[11px] font-black tracking-wider text-[#064e3b]/60">
                        {activeIssue.key}
                      </span>
                    </div>
                    <span className="min-w-0 flex-1 truncate font-manrope text-[13px] font-bold text-[#064e3b]">
                      {activeIssue.summary}
                    </span>
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
