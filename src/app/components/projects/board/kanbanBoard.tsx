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
    <div className="flex h-full overflow-hidden px-4 pb-10">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex h-full gap-4 overflow-x-auto pb-4 custom-scrollbar">
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
              <div className="h-fit w-80 min-w-80">
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-[#064e3b]/5 border-2 border-dashed border-[#064e3b]/20 p-6 text-[13px] font-bold uppercase tracking-widest text-[#064e3b] transition-all duration-300 hover:bg-[#064e3b]/10 hover:border-[#064e3b]/40 font-manrope shadow-button"
                >
                  <LuCirclePlus size={20} className="text-[#064e3b]" />
                  <span>Add New Stage</span>
                </button>
              </div>
            ) : (
              <div className="h-fit w-80 min-w-80 flex flex-col">
                <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl border border-[#064e3b]/10 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]/50">Stage Name</p>
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
                      placeholder="e.g. READY FOR QA"
                      className="w-full rounded-xl border border-[#e8e8e7] bg-[#f9f9f8] px-4 py-3 text-sm text-[#064e3b] placeholder-[#064e3b]/30 focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] focus:outline-none font-manrope font-semibold transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3">
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
                      className="flex-1 rounded-xl bg-[#064e3b] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#059669] shadow-md"
                    >
                      Create Stage
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColumnText("");
                      }}
                      className="rounded-xl bg-[#f1f5f3] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#064e3b] transition-all hover:bg-[#e2e8e5]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeIssue && (
            <div className="rotate-3 scale-105 shadow-2xl transition-transform">
              <IssueCard issue={activeIssue} isDragging={false} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>

  );
}
