import ColumnDropdown from "./columnDropdown";
import { ITeam } from "@libs/types/team";
import { useProjectTeams } from "@libs/hooks/apis/useTeam";
import TeamBadge from "../badge/teamBadge";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { memo, useMemo, useState } from "react";
import { useAuthStore } from "@libs/store/useAuthStore";

const TeamDropdown = ({
  projectId,
  issueId,
  selectedTeamId,
  columnField = "team_id",
  isDisplayName = true,
  team: defaultTeam,
}: {
  projectId: string;
  issueId: string;
  selectedTeamId: string;
  columnField?: string;
  isDisplayName?: boolean;
  team?: ITeam;
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const { teams } = useProjectTeams(projectId, isOpenDropdown);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeTeam = (teamId: string) => {
    updateIssueAsync({
      id: issueId,
      data: { [columnField]: teamId },
    });
  };
  const currentTeam = useMemo(() => {
    return teams?.find((team: ITeam) => team.id === selectedTeamId);
  }, [selectedTeamId, teams]);
  const selectedTeam = defaultTeam ?? currentTeam;

  const { user } = useAuthStore();
  return (
    <ColumnDropdown
      disabled={user?.projectRole !== "OWNER" && user?.projectRole !== "ADMIN"}
      items={
        teams &&
        teams
          .map((team: ITeam) => ({
            value: team.name,
            key: team.id,
            style: {
              padding: 0,
              background: "white",
              border: "none",
              boxShadow: "none",
            },
            label: (
              <div className="border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 font-manrope">
                <TeamBadge
                  team={team}
                  isShowLabel={true}
                  className="hover:bg-transparent!"
                />
              </div>
            ),
            onClick: () => {
              handleChangeTeam(team.id);
            },
          }))
          .concat({
            value: "Unassigned",
            key: "Unassigned",
            style: {
              padding: 0,
              background: "white",
              border: "none",
              boxShadow: "none",
            },
            label: (
              <div className="flex items-center gap-2 border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 font-manrope group">
                <div className="h-4 w-4 rounded-full bg-[#e8e8e7] border border-white flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#404944]/30"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#404944]/50 group-hover:text-[#064e3b]">Unassigned</span>
              </div>
            ),
            onClick: () => {
              handleChangeTeam("NULL");
            },
          })
      }
      children={
        selectedTeam ? (
          <TeamBadge team={selectedTeam} isShowLabel={isDisplayName} />
        ) : (
          <div className="flex items-center gap-2 px-1 font-manrope">
            <div className="h-4 w-4 rounded-full bg-[#e8e8e7] border border-white flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#404944]/30"></div>
            </div>
            {isDisplayName && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#404944]/40">Unassigned</span>
            )}
          </div>
        )
      }
      setIsOpenDropdown={setIsOpenDropdown}
    />
  );
};

export default memo(TeamDropdown);
