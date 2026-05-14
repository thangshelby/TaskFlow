import { UserPlus } from "lucide-react";
import { Popover } from "antd";
import ProjectMemberInvitations from "./modals/project/projectMemberInvitations";
import { useUserMemberships } from "@libs/hooks/apis/useProjectMember";

interface ProjectInvitationsPopoverProps {
  userId: string;
}

const ProjectInvitationsPopover: React.FC<ProjectInvitationsPopoverProps> = ({
  userId,
}) => {
  const { memberships } = useUserMemberships(userId);
  const pendingInvitations = memberships.filter((member) => member.is_pending);

  const content = <ProjectMemberInvitations userId={userId} />;

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <button 
        aria-label="View project invitations"
        className="relative cursor-pointer p-2.5 text-[#404944] hover:text-[#064e3b] transition-all rounded-full hover:bg-[#eeeeed] active:scale-95"
      >
        <UserPlus size={22} />
        {pendingInvitations.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow-sm border border-white">
            <span className="text-[10px] font-bold text-white">
              {pendingInvitations.length}
            </span>
          </span>
        )}
      </button>
    </Popover>
  );
};

export default ProjectInvitationsPopover;
