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
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 group font-manrope`}
            >
              <p className="text-xs font-bold text-[#404944] group-hover:text-[#064e3b] tracking-tight">{sprint.name}</p>
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
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 group font-manrope`}
            >
              <p className="truncate text-xs font-bold text-[#404944] group-hover:text-[#064e3b] tracking-tight opacity-50 uppercase">Unassigned</p>
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
      <div className="group font-manrope">
        <div className="flex justify-start rounded-lg border border-[#e8e8e7] bg-white px-2 py-1 transition-all duration-300 group-hover:border-[#064e3b]/30 group-hover:bg-[#f9f9f8] shadow-sm">
          <p className={`truncate text-xs font-bold tracking-tight ${currentSprint ? "text-[#064e3b]" : "text-[#404944]/50"}`}>
            {currentSprint?.name || "Unassigned"}
          </p>
        </div>
      </div>
    </ColumnDropdown>
  );

};

export default SprintDropdown;
