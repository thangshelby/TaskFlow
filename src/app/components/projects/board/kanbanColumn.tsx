import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DeleteColumnModal from "@libs/app/components/projects/modals/column/deleteColumnModal";
import RenameColumnModal from "@libs/app/components/projects/modals/column/renameColumnModal";
import {
  useDeleteColumn,
  useUpdateColumn,
  useUpdateProjectOrderColumn,
} from "@libs/hooks/apis/useProject";
import { IIssue } from "@libs/types/issue";
import { IColumn } from "@libs/types/project";
import { Popover } from "antd";
import { ReactNode, useCallback, useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import { Check } from "lucide-react";
import { useOverItem } from "@libs/app/context/board.context";
import IssueCard from "@libs/app/components/projects/board/issueCard";
import { useDroppable } from "@dnd-kit/core";
export const KanbanColumn = ({
  columns,
  column,
  setColumns,
  projectId,
  isDragging,
}: {
  columns: IColumn[];
  column: IColumn;
  projectId: string | undefined;
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>;
  isDragging: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column?.id,
    data: {
      type: "Column",
      column,
    },
  });
  const { updateOrderColumn } = useUpdateProjectOrderColumn();
  const [showRenameColumnModal, setShowRenameColumnModal] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { updateColumn } = useUpdateColumn();
  const { deleteColumn } = useDeleteColumn((deletedColumnId) => {
    // Xử lý sau khi xóa thành công
    const newColumns = columns
      .filter((col) => col?.id !== deletedColumnId)
      .map((col, index) => ({
        ...col,
        order: index,
      }));

    setColumns(newColumns);
  });
  const { overItemId } = useOverItem();
  const handleMove = useCallback(
    (direction: "left" | "right") => {
      const currentIndex = columns.findIndex((c) => c?.id === column?.id);
      const targetIndex =
        direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= columns.length) return;

      const newColumns = [...columns];
      [newColumns[currentIndex], newColumns[targetIndex]] = [
        newColumns[targetIndex],
        newColumns[currentIndex],
      ];

      const reordered = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setColumns(reordered);

      updateOrderColumn({
        projectId: projectId || "",
        columns: reordered.map((col) => ({
          id: col?.id,
          order: col?.order + 1,
        })),
      });
      setPopoverOpen(false);
    },
    [columns, column?.id, projectId, updateOrderColumn],
  );
  const handleRenameColumn = useCallback((newName: string) => {
    const newColumns = columns.map((col) => {
      if (col?.id === column?.id) {
        return { ...col, name: newName };
      }
      return col;
    });
    setColumns(newColumns);
    setShowRenameColumnModal(false);
    if (projectId) {
      updateColumn({
        column_id: column?.id,
        name: newName,
        projectId: projectId,
      });
    }
  }, []);
  const handleDeleteColumn = () => {
    // Kiểm tra nếu còn issue thì không xó
    setShowDeleteColumnModal(false);

    if (projectId) {
      deleteColumn({ column_id: column?.id });
    }
  };
  const content: ReactNode = (
    <div className="">
      <div
        onClick={() => handleMove("left")}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Move to left
      </div>
      <div
        onClick={() => handleMove("right")}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Move to right
      </div>
      <div
        onClick={() => {
          setShowRenameColumnModal(true);
          setPopoverOpen(false);
        }}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Change column name
      </div>
      <div
        onClick={() => {
          setShowDeleteColumnModal(true);
          setPopoverOpen(false);
        }}
        className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
      >
        Delete column
      </div>
    </div>
  );
  return (
    <div
      ref={setNodeRef}
      className={`mx-1 w-80 min-w-80 rounded-md bg-[#f9f9f8]/80 border border-[#e8e8e7] flex flex-col h-fit max-h-full transition-colors duration-200 ${isOver ? "bg-[#f0fdf4] border-[#064e3b]/20" : ""}`}
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-[11px] font-bold text-[#064e3b] font-manrope uppercase tracking-widest leading-none">
              {column?.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black bg-[#064e3b] text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-sm">
                {column?.issues?.length ?? 0}
              </span>
              {column?.name === "DONE" && (
                <Check className="text-[#059669]" size={12} strokeWidth={4} />
              )}
            </div>
          </div>
        </div>
        <Popover
          content={content}
          trigger="click"
          placement="bottomRight"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          overlayClassName="premium-popover"
        >
          <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-[#064e3b]/10 text-[#064e3b]/60 hover:text-[#064e3b]">
            <LuEllipsisVertical size={18} />
          </div>
        </Popover>
      </div>

      <SortableContext
        strategy={horizontalListSortingStrategy}
        items={column?.issues?.map((issue) => issue?.id) || []}
      >
        <div className="flex flex-col overflow-y-auto px-3 pb-6 pt-2 custom-scrollbar min-h-[150px]">
          {column?.issues?.map((issue) => {
            const newColumn: IColumn = { ...column };
            delete (newColumn as any).issues;
            const newIssue: IIssue = { ...issue, column: newColumn };

            return (
              <div key={issue?.id} className="group relative mb-3">
                {/* Drop Indicator */}
                <div
                  style={{
                    opacity: isDragging && issue?.id === overItemId ? 1 : 0,
                  }}
                  className="absolute top-[-6px] left-0 z-50 flex w-full flex-row items-center transition-opacity duration-200"
                >
                  <div className="h-[3px] w-full bg-[#064e3b] rounded-full shadow-[0_0_8px_rgba(6,78,59,0.5)]" />
                </div>

                <IssueCard issue={newIssue} />
              </div>
            );
          })}

          {/* Empty state or tail drop indicator */}
          <div className="relative h-2">
            <div
              style={{
                opacity: isDragging && isOver && column.issues.length === 0 ? 1 : 0,
              }}
              className="absolute top-0 left-0 z-50 flex w-full flex-row items-center transition-opacity duration-200"
            >
              <div className="h-[3px] w-full bg-[#064e3b] rounded-full shadow-[0_0_8px_rgba(6,78,59,0.5)]" />
            </div>
          </div>
        </div>
      </SortableContext>

      {showRenameColumnModal && (
        <RenameColumnModal
          onClose={() => {
            setShowRenameColumnModal(false);
          }}
          onSubmit={handleRenameColumn}
        />
      )}
      {showDeleteColumnModal && (
        <DeleteColumnModal
          onClose={() => {
            setShowDeleteColumnModal(false);
          }}
          onSubmit={handleDeleteColumn}
        />
      )}
    </div>
  );
};
