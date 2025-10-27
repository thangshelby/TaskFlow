import ColumnDropdown from "./columnDropdown";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useProjectSprints } from "@libs/hooks/apis/useSprint";
import { ISprint } from "@libs/types/sprint";
import { useMemo } from "react";

const SprintDropdown = ({
  projectId,
  issueId,
  sprintId,
}: {
  projectId: string;
  issueId: string;
  sprintId: string;
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const { sprints } = useProjectSprints(projectId);
  const handleChangeSprint = (updatedSprintId: string) => {
    updateIssueAsync({
      id: issueId,
      data: {
        sprint_id: updatedSprintId,
      },
    });
  };

  const currentSprint = useMemo(() => {
    return sprints.find((sprint) => sprint.id === sprintId);
  }, [sprintId, sprints]);

  return (
    <ColumnDropdown
      items={sprints
        .map((sprint: ISprint) => ({
          value: sprint.name,
          key: sprint.id,
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200`}
            >
              <p className="text-sm font-medium">{sprint.name}</p>
            </div>
          ),
          onClick: () => {
            handleChangeSprint(sprint.id);
          },
        }))
        .concat({
          value: "",
          key: "unassigned",
          style: {
            padding: 0,
            background: "white",
          },
          label: (
            <div
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200`}
            >
              <p className="truncate text-sm font-medium">Unassigned</p>
            </div>
          ),
          onClick: () => {
            handleChangeSprint("NULL");
          },
        })}
      currentItem={
        currentSprint
          ? sprints.find((sprint: ISprint) => sprint.id === currentSprint.id)
              ?.name
          : "Unassigned"
      }
    >
      <div className="">
        <div className="flex justify-start rounded-sm border-1 border-gray-200 px-1 py-0.5">
          <p className={`truncate text-sm font-normal text-gray-800`}>
            {currentSprint?.name || "Unassigned"}
          </p>
        </div>
      </div>
    </ColumnDropdown>
  );
};

export default SprintDropdown;
