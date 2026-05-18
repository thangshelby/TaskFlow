import React, { lazy } from "react";
import Roadmap from "@libs/app/components/projects/roadmap/roadmap";
import { useParams } from "react-router-dom";
import RoadmapFilter from "@libs/app/components/projects/roadmap/roadmapFilter";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import TaskItem from "@libs/app/components/projects/roadmap/task-item";
import { Helmet } from "react-helmet-async";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useRoadmapPage } from "@libs/hooks/pages/useRoadmapPage";
import { SortableContext } from "@dnd-kit/sortable";
const UnscheduledWork = lazy(
  () => import("@libs/app/components/projects/roadmap/unscheduledWork"),
);

const RoadmapPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    currentDate,
    isOpenUnscheduledWork,
    activeIssue,
    overDate,
    filters,
    setFilters,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    goToToday,
    previousMonth,
    nextMonth,
    handleToggleUnscheduledWork,
    isLoadingProjectIssues,
    calendarDays,
  } = useRoadmapPage({ projectId: projectId || "" });

  return (
    <div className="flex h-full w-full flex-col gap-6 -m-6">
      <Helmet>
        <title>Roadmap - Task Flow</title>
      </Helmet>


      <div className="flex flex-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={Object.keys(calendarDays)
              .map((dateStr: string) => dateStr)
              .concat("unscheduled-work")}
          >
            <PanelGroup
              className="flex w-full flex-1"
              autoSaveId="backlog-panel-group"
              direction="horizontal"
            >
              <Panel
                id="roadmap-panel"
                order={1}
                defaultSize={isOpenUnscheduledWork ? 70 : 100}
                minSize={60}
                maxSize={100}
              >
                <div className="flex h-full flex-col gap-4 pr-4 p-5 mr-2">
                  <RoadmapFilter
                    initialFilters={filters}
                    setSearchParams={setFilters}
                    goToToday={goToToday}
                    previousMonth={previousMonth}
                    currentDate={currentDate}
                    nextMonth={nextMonth}
                    handleToggleUnscheduledWork={handleToggleUnscheduledWork}
                  />

                  <Roadmap
                    isLoadingProjectIssues={isLoadingProjectIssues}
                    calendarDays={calendarDays}
                    activeDate={overDate}
                  />
                </div>
              </Panel>

              {isOpenUnscheduledWork && (
                <PanelResizeHandle
                  style={{
                    backgroundColor: "oklch(0.696 0.17 162.48)",
                  }}
                  className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
                />

              )}

              {isOpenUnscheduledWork && (
                <Panel
                  id="unscheduled-work-panel"
                  order={2}
                  defaultSize={30}
                  maxSize={40}
                  minSize={20}
                >
                  <div className="h-full overflow-y-auto p-1 ml-2">
                    <UnscheduledWork
                      handleToggleUnscheduledWork={handleToggleUnscheduledWork}
                      projectId={projectId || ""}
                      isOver={overDate === "unscheduled-work"}
                    />
                  </div>
                </Panel>
              )}
            </PanelGroup>
          </SortableContext>
          <DragOverlay>
            {activeIssue ? <TaskItem issue={activeIssue} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default RoadmapPage;
