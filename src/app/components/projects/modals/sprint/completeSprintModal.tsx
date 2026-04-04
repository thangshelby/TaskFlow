import React from "react";
import { Info } from "lucide-react";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useProjectSprints } from "@libs/hooks/apis/useSprint";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { ISprint } from "@libs/types/sprint";
import { IIssue } from "@libs/types/issue";

interface CompleteSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sprint: ISprint & { issues?: IIssue[] };
}

const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
  isOpen,
  onClose,
  projectId,
  sprint,
}) => {
  const { sprints } = useProjectSprints(projectId);
  const otherSprints = (sprints || []).filter((s) => s.id !== sprint.id);
  const { updateIssueAsync, isLoading } = useUpdateIssue({ projectId });

  const [targetSprintId, setTargetSprintId] = React.useState<string>("");

  const issues = sprint.issues || [];
  const completedIssues = issues.filter(
    (issue) => issue.column?.name?.toLowerCase() === "done",
  );
  const openIssues = issues.filter(
    (issue) => issue.column?.name?.toLowerCase() !== "done",
  );

  if (!isOpen) return null;

  const handleComplete = async () => {
    try {
      for (const issue of openIssues) {
        await updateIssueAsync({
          id: issue.id,
          data: { sprint_id: targetSprintId || undefined },
        });
      }
      onClose();
    } catch (e) {}
  };

  return (
    <Modal
      title={`Complete Sprint: ${sprint.name}`}
      onClose={onClose}
      buttonContent={isLoading ? "Completing..." : "Complete Sprint"}
      isLoadingButton={isLoading}
      onSubmit={handleComplete}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="text-sm leading-relaxed text-gray-700">
          This sprint contains{" "}
          <span className="font-semibold text-green-600">
            {completedIssues.length} completed
          </span>{" "}
          work items and{" "}
          <span className="font-semibold text-red-600">
            {openIssues.length} open
          </span>{" "}
          work items.
          <ul className="mt-3 ml-6 list-disc space-y-1 text-gray-600">
            <li>
              Completed work items include everything in the <b>Done</b> column.
            </li>
            <li>
              Open work items include everything in other columns. Move these to
              another sprint or backlog.
            </li>
          </ul>
        </div>

        {/* Move to */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Move open work items to
          </label>
          <DropdownAntd
            options={[
              { value: "", label: "Backlog" },
              ...otherSprints.map((s) => ({ value: s.id, label: s.name })),
            ]}
            placement="bottom"
            rowClassName="w-full text-[15px]"
            menuClassName="min-w-[260px]"
            parent={
              <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:border-gray-400 focus:ring-2 focus:ring-green-500">
                {targetSprintId
                  ? otherSprints.find((s) => s.id === targetSprintId)?.name
                  : "Backlog"}
              </button>
            }
            onClickItem={(opt) => setTargetSprintId(opt.value)}
          />
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
          <Info className="mt-[2px] h-4 w-4 shrink-0" />
          <span>
            Completing a sprint does not delete it. You can still view sprint
            reports and history later.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteSprintModal;
