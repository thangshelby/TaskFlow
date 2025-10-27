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
    <div ref={setNodeRef} className="mx-1 w-80 rounded bg-gray-100 py-2">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          <h2 className="text-sm font-medium text-gray-500">{column?.name}</h2>
          <span className="rounded-sm bg-gray-300 px-2 text-xs font-medium text-gray-500">
            {column?.issues.length}
          </span>

          {column?.name === "DONE" && (
            <Check className="ml-2 text-emerald-500" size={20} />
          )}
        </div>
        <Popover
          content={content}
          trigger="click"
          placement="bottomRight"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
        >
          <div className="cursor-pointer rounded-md p-2 transition-all hover:bg-gray-200">
            <LuEllipsisVertical className="text-gray-500" />
          </div>
        </Popover>
      </div>
      <SortableContext
        strategy={horizontalListSortingStrategy}
        items={column?.issues?.map((issue) => issue?.id) || []}
      >
        <div className="flex h-full flex-col overflow-auto p-2 px-3 pb-32">
          {column?.issues?.map((issue) => {
            const newColumn: IColumn = { ...column };
            delete (newColumn as any).issues;
            const newIssue: IIssue = { ...issue, column: newColumn };

            return (
              <div key={issue?.id} className="group relative">
                <div
                  style={{
                    opacity: isDragging && issue?.id === overItemId ? 1 : 0,
                  }}
                  className="absolute top-[-2px] left-0 z-50 flex w-full flex-row items-center"
                >
                  <div className="h-[2px] w-full bg-emerald-500" />
                </div>

                <div
                  style={{
                    opacity: isDragging && issue?.id === overItemId ? 1 : 0,
                  }}
                  className="absolute top-[-6px] left-[-10px] z-50 flex w-full flex-row items-center"
                >
                  <div className="z-50 rounded-[100%] border border-emerald-500 p-1" />
                </div>

                <IssueCard issue={newIssue} />
              </div>
            );
          })}

          <div className="group relative">
            <div
              style={{
                opacity: isDragging && isOver ? 1 : 0,
              }}
              className="absolute top-[-2px] left-0 z-50 flex w-full flex-row items-center"
            >
              <div className="h-[2px] w-full bg-emerald-500" />
            </div>

            <div
              style={{
                opacity: isDragging && isOver ? 1 : 0,
              }}
              className="absolute top-[-6px] left-[-10px] z-50 flex w-full flex-row items-center"
            >
              <div className="z-50 rounded-[100%] border border-emerald-500 p-1" />
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
