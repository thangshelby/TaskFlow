import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IColumn } from "@libs/types/project";
import { IIssue, IIssueWithoutCoulumn } from "@libs/types/issue";
import { useParams } from "react-router-dom";
import { useAddProjectColumn } from "@libs/hooks/apis/useProject";
import { LuCirclePlus } from "react-icons/lu";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { KanbanColumn } from "@libs/app/components/projects/board/kanbanColumn";
import IssueCard from "./issueCard";
import { useOverItem } from "@libs/app/context/board.context";

export default function KanbanBoard({
  initialColumns,
}: {
  initialColumns: IColumn[];
}) {
  const { projectId } = useParams();

  const [columns, setColumns] = useState<IColumn[]>(initialColumns);
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [newColumnText, setNewColumnText] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { setOverItemId } = useOverItem();
  const { updateIssue } = useUpdateIssue({
    projectId: projectId || "",
    isNotToasting: true,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  // When drag starts, set the active issue
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const issueId = active.id as string;

      // Find the active issue across all columns
      for (const column of columns) {
        const issue = column.issues.find((issue) => issue.id === issueId);
        if (issue) {
          const newColumn: IColumn = { ...column };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (newColumn as any).issues;

          const newIssue: IIssue = { ...issue, column: newColumn };
          setActiveIssue(newIssue);
          setActiveColumn(column.id);
          break;
        }
      }
    },
    [columns, activeIssue],
  );

  // Handler for when item is dragged over a droppable area
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over) return;
      const overId = over.id as string;

      setOverItemId(overId);
    },
    [columns, activeIssue],
  );

  // When drag ends
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveIssue(null);
      setActiveColumn(null);
      setOverItemId("");

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;
      if (activeId === overId) return;

      if (over.data.current?.type === "Column") {
        const targetColumn = over.data.current?.column;
        setColumns((prevColumns: IColumn[]) => {
          const sourceColumnIndex = prevColumns.findIndex(
            (column) => column.id === activeColumn,
          );
          const newColumns = [...prevColumns];
          const activeIssue = newColumns[sourceColumnIndex].issues.find(
            (issue) => issue.id === activeId,
          );

          newColumns[sourceColumnIndex].issues = newColumns[
            sourceColumnIndex
          ].issues.filter((issue) => issue.id !== activeId);

          const targetColumnIndex = newColumns.findIndex(
            (column) => column.id === targetColumn.id,
          );

          newColumns[targetColumnIndex] = {
            ...newColumns[targetColumnIndex],
            issues: [
              ...newColumns[targetColumnIndex].issues,
              activeIssue as IIssueWithoutCoulumn,
            ],
          };
          return newColumns;
        });
        if (targetColumn) {
          updateIssue({
            id: activeId,
            data: {
              column_id: targetColumn.id,
            },
          });
        }
        return;
      }

      // We're dropping onto another issue
      setColumns((prevColumns) => {
        // Find the column containing our active issue
        const activeColumnIndex = prevColumns.findIndex((column) =>
          column.issues.some((issue) => issue.id === activeId),
        );

        // Find the column containing the issue we're dropping onto
        const overColumnIndex = prevColumns.findIndex((column) =>
          column.issues.some((issue) => issue.id === overId),
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        // Same column reordering
        if (activeColumnIndex === overColumnIndex) {
          const column = prevColumns[activeColumnIndex];
          const oldIndex = column.issues.findIndex(
            (issue) => issue.id === activeId,
          );
          const newIndex = column.issues.findIndex(
            (issue) => issue.id === overId,
          );

          const newColumns = [...prevColumns];
          newColumns[activeColumnIndex] = {
            ...column,
            issues: arrayMove(column.issues, oldIndex, newIndex),
          };

          return newColumns;
        }
        // Cross-column movement
        if (activeColumnIndex !== overColumnIndex) {
          setColumns((prevColumns: IColumn[]) => {
            const sourceColumnIndex = prevColumns.findIndex(
              (column) => column.id === activeColumn,
            );
            // Get the active issue
            const issueToMove = prevColumns[sourceColumnIndex].issues.find(
              (issue) => issue.id === activeId,
            );
            const newColumns = [...prevColumns];

            // Remove from source
            newColumns[sourceColumnIndex] = {
              ...newColumns[sourceColumnIndex],
              issues: newColumns[sourceColumnIndex].issues.filter(
                (issue) => issue.id !== activeId,
              ),
            };

            // Find where to insert in target
            const overIssueIndex = newColumns[overColumnIndex].issues.findIndex(
              (issue) => issue.id === overId,
            );
            // Insert in target
            newColumns[overColumnIndex] = {
              ...newColumns[overColumnIndex],
              issues: [
                ...newColumns[overColumnIndex].issues.slice(0, overIssueIndex),
                issueToMove,
                ...newColumns[overColumnIndex].issues.slice(overIssueIndex),
              ] as IIssueWithoutCoulumn[],
            };

            return newColumns;
          });
        }

        return prevColumns;
      });
      if (projectId) {
        const targetColumn = columns.find((col) =>
          col.issues.some((issue) => issue.id === overId),
        );
        if (targetColumn) {
          updateIssue({
            id: activeId,
            data: {
              column_id: targetColumn.id,
            },
          });
        }
      }
    },
    [columns, activeIssue],
  );
  const { createColumn } = useAddProjectColumn({
    setColumns: setColumns,
  });

  return (
    <div className="flex h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        // collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              setColumns={setColumns}
              columns={columns}
              projectId={projectId}
              isDragging={activeIssue !== null}
            />
          ))}
          {/* Add Stage Section */}
          {!isAddingColumn ? (
            <div className="flex h-fit w-80 min-w-80 px-4">
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex w-full items-center gap-2 rounded-lg bg-gray-100/50 p-4 font-semibold text-gray-600 transition-all hover:bg-gray-200/70"
              >
                <LuCirclePlus size={20} />
                <span>Add Stage</span>
              </button>
            </div>
          ) : (
            <div className="flex h-fit w-80 min-w-80 flex-col gap-2 px-4">
              <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <input
                  id="new-stage-name"
                  autoFocus
                  autoComplete="off"
                  value={newColumnText}
                  onChange={(e) => {
                    setNewColumnText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newColumnText && projectId) {
                      createColumn({
                        name: newColumnText,
                        projectId: projectId,
                      });
                      setNewColumnText("");
                      setIsAddingColumn(false);
                    } else if (e.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnText("");
                    }
                  }}
                  placeholder="Name this stage"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!newColumnText || !projectId) return;
                      createColumn({
                        name: newColumnText,
                        projectId: projectId,
                      });
                      setNewColumnText("");
                      setIsAddingColumn(false);
                    }}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                  >
                    Add Stage
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnText("");
                    }}
                    className="rounded-md bg-transparent px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </SortableContext>
        <DragOverlay>
          {activeIssue && <IssueCard issue={activeIssue} isDragging={false} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
