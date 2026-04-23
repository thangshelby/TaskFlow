import { useEffect, useState } from "react";
import { IIssue } from "@libs/types/issue";
import { GetIssuesParams } from "@libs/types/issue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { useCallback, useTransition } from "react";
import {
  useSensors,
  useSensor,
  PointerSensor,
  MouseSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";

export const useRoadmapPage = ({ projectId }: { projectId: string }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpenUnscheduledWork, setIsOpenUnscheduledWork] = useState(() => {
    const saved = localStorage.getItem("roadmap-unscheduled-work-open");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [overDate, setIsoverDate] = useState("");
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId || "",
    is_fetch: true,
    limit: 100,
  });
  const { updateIssue } = useUpdateIssue({ projectId: projectId || "" });

  useEffect(() => {
    localStorage.setItem(
      "roadmap-unscheduled-work-open",
      JSON.stringify(isOpenUnscheduledWork),
    );
  }, [isOpenUnscheduledWork]);

  const [, startTransition] = useTransition();

  const { issues, isLoading: isLoadingProjectIssues } =
    useProjectIssues(filters);
  // Group tasks by date
  const getIssuesForDate = useCallback(
    (date: Date): IIssue[] => {
      return issues.filter((issue) => {
        const issueDate = new Date(issue.due_date_to || "");
        return (
          issueDate.getDate() === date.getDate() &&
          issueDate.getMonth() === date.getMonth() &&
          issueDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [issues],
  );
  const [calendarDays, setCalendarDays] = useState<Record<string, IIssue[]>>(
    {},
  );
  useEffect(() => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Find first Sunday (may be in previous month)
    const startDate = new Date(firstDay);
    while (startDate.getDay() !== 0) {
      // 0 represents Sunday
      startDate.setDate(startDate.getDate() - 1);
    }

    // Find last Saturday (may be in next month)
    const endDate = new Date(lastDay);
    while (endDate.getDay() !== 6 && endDate.getDay() !== 0) {
      // 6 represents Saturday
      endDate.setDate(endDate.getDate() + 1);
    }

    // Generate all days between start and end
    const days: Record<string, IIssue[]> = {};
    const iterDate = new Date(startDate);

    while (iterDate <= endDate) {
      if (iterDate.getDay() !== 0 && iterDate.getDay() !== 6)
        // Skip Sundays and Saturdays
        days[iterDate.toISOString()] = getIssuesForDate(iterDate);
      iterDate.setDate(iterDate.getDate() + 1);
    }
    setCalendarDays(days);
  }, [currentDate, issues]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(MouseSensor));
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeIssue = issues.find((issue) => issue.id === active.id);
    console.log("activeIssue", activeIssue);
    setActiveIssue(activeIssue!);
  };
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || !activeIssue) return;

    const overId = over.id as string;
    const activeId = active.id as string;
    if (overId === activeId) return;
    if (overId == "unscheduled-work") {
      setIsoverDate("unscheduled-work");
      return;
    }

    const isOverDate = Object.keys(calendarDays).findIndex(
      (date) => date === overId,
    );
    if (isOverDate >= 0) {
      setIsoverDate(overId);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveIssue(null);
    setIsoverDate("");

    const { active, over } = e;
    if (!over || !activeIssue) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    if (overId === "unscheduled-work") {
      updateIssue({
        id: activeId,
        data: {
          due_date_to: "NULL",
        },
      });
      return;
    }

    const isOverDate = Object.keys(calendarDays).findIndex(
      (date) => date === overId,
    );

    if (isOverDate >= 0) {
      const oldDate = Object.keys(calendarDays).find((date) =>
        calendarDays[date].includes(activeIssue as IIssue),
      );
      if (oldDate && oldDate !== overId) {
        calendarDays[oldDate!].splice(
          calendarDays[oldDate!].indexOf(activeIssue as IIssue),
          1,
        );
      }
      calendarDays[overId].push(activeIssue as IIssue);
      updateIssue({
        id: activeId,
        data: {
          due_date_to: new Date(overId).toISOString(),
        },
      });
    }
  };

  const goToToday = () => setCurrentDate(new Date());
  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const handleToggleUnscheduledWork = useCallback(() => {
    startTransition(() => {
      setIsOpenUnscheduledWork(!isOpenUnscheduledWork);
    });
  }, [isOpenUnscheduledWork]);

  return {
    currentDate,
    isOpenUnscheduledWork,
    activeIssue,
    overDate,
    filters,
    setFilters,
    updateIssue,
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
    setCalendarDays,
    setActiveIssue,
    setIsoverDate,
    setIsOpenUnscheduledWork,
    setCurrentDate,
  };
};
