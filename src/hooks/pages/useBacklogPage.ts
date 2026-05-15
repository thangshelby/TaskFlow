import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useProjectSprints } from "@libs/hooks/apis/useSprint";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { getIssuesNotEpic } from "@libs/utils/issue";
import { useIssueStore } from "@libs/store/useIssueStore";
import { useOverItem } from "@libs/app/context/backlog.context";
import {
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ISprint } from "@libs/types/sprint";
import { IIssue } from "@libs/types/issue";
import { GetIssuesParams } from "@libs/types/issue";

interface ISprintIssues extends ISprint {
  issues: IIssue[];
}

const backLogSprint: ISprintIssues = {
  id: "",
  name: "Backlog",
  date_started: new Date().toISOString(),
  date_ended: new Date().toISOString(),
  project_id: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  issues: [],
  duration: 0,
  goal: "",
};

export const useBackLogPage = (projectId: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId,
    limit: 100,
    is_fetch: true,
  });
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState<{
    isOpen: boolean;
    sprint: ISprint | null | ISprintIssues;
  }>({ isOpen: false, sprint: null });
  const { selectedIssueId } = useIssueStore();
  const { setOverItemId } = useOverItem();
  const [_, startTransition] = useTransition();
  const { sprints, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const { issues, isLoading: isLoadingIssues } = useProjectIssues(filters);
  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sprintIssues, setSprintIssues] = useState<ISprintIssues[]>([]);

  useEffect(() => {
    if (!isLoadingSprints && !isLoadingIssues) {
      const issuesNotEpic = getIssuesNotEpic(issues);
      setSprintIssues(
        [...sprints, backLogSprint].map((sprint: ISprint) => ({
          ...sprint,
          issues: issuesNotEpic.filter(
            (i: IIssue) => i.sprint_id === sprint.id,
          ),
        })),
      );
    }
  }, [sprints, issues, isLoadingSprints, isLoadingIssues]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const issueId = event.active.id as string;
      for (const sprint of sprintIssues) {
        const issue = sprint.issues.find((i) => i.id === issueId);
        if (issue) {
          setActiveIssue(issue);
          break;
        }
      }
      setIsDragging(true);
    },
    [sprintIssues],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      setOverItemId(over?.id as string);
    },
    [setOverItemId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!sprintIssues.length) {
        return;
      }
      setIsDragging(false);
      setActiveIssue(null);
      setOverItemId(null);
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      if (over?.data?.current?.type === "epic") {
        updateIssueAsync({
          id: active.id as string,
          data: {
            parent_id: over.id === "no-epic" ? "NULL" : (over.id as string),
          },
        });
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      const isOverSprint = sprintIssues.find((sprint) =>
        sprint.issues?.some((issue) => issue.id === overId),
      )
        ? false
        : true;

      // Find the sprint that the issue is being dragged over
      const targetSprint =
        over?.data?.current?.type === "Sprint"
          ? over.data.current.sprint
          : sprintIssues.find((sprint) =>
              sprint.issues?.some((issue) => issue.id === overId),
            ) || sprintIssues.find((sprint) => sprint.id === overId);
      const activeSprint = sprintIssues.find((sprint) =>
        sprint.issues?.some((issue) => issue.id === activeId),
      );

      //Drop into the same sprint
      if (targetSprint?.id == activeSprint?.id) {
        if (targetSprint?.id == overId) return;
        setSprintIssues((prevSprints) => {
          const newSprints = prevSprints.map((sprint) => ({
            ...sprint,
            issues: [...sprint.issues],
          }));
          const targetSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id === targetSprint?.id,
          );

          const activeIssueIndex = newSprints[
            targetSprintIndex
          ].issues.findIndex((issue) => issue.id === activeId);
          const activeIssue =
            newSprints[targetSprintIndex].issues[activeIssueIndex];
          const overIssueIndex = newSprints[targetSprintIndex].issues.findIndex(
            (issue) => issue.id === overId,
          );

          newSprints[targetSprintIndex].issues[activeIssueIndex] =
            newSprints[targetSprintIndex].issues[overIssueIndex];
          newSprints[targetSprintIndex].issues[overIssueIndex] = activeIssue;

          return newSprints;
        });
        return;
      }

      //Drop into another sprint
      else {
        //Drop into an empty sprint
        setSprintIssues((prevSprints) => {
          const newSprints = prevSprints.map((sprint) => ({
            ...sprint,
            issues: [...sprint.issues],
          }));
          const targetSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id == targetSprint?.id,
          );
          const activeSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id == activeSprint?.id,
          );
          const activeIssueIndex = newSprints[
            activeSprintIndex
          ].issues.findIndex((issue) => issue.id == activeId);

          //Remove the issue from the active/original sprint
          newSprints[activeSprintIndex].issues.splice(activeIssueIndex, 1);

          if (!activeIssue) return prevSprints;

          //Drop into the target sprint
          if (isOverSprint) {
            newSprints[targetSprintIndex].issues.push(activeIssue as IIssue);
          } else {
            const targetIssueIndex = newSprints[
              targetSprintIndex
            ].issues.findIndex((issue) => issue.id == overId);

            newSprints[targetSprintIndex].issues.splice(
              targetIssueIndex,
              0,
              activeIssue as IIssue,
            );
          }
          return newSprints;
        });

        if (projectId) {
          if (targetSprint) {
            updateIssueAsync({
              id: activeId,
              data: {
                sprint_id: targetSprint.id === "" ? undefined : targetSprint.id,
              },
            });
          }
        }
      }
    },
    [sprintIssues, updateIssueAsync, projectId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  return {
    projectId,
    containerRef,
    filters,
    setFilters,
    sprints,
    issues,
    sprintIssues,
    isLoadingSprints,
    isLoadingIssues,
    selectedIssueId,
    isDragging,
    activeIssue,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isCreateSprintModalOpen,
    setIsCreateSprintModalOpen,
    startTransition,
  };
};
