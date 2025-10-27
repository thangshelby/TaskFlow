import React from "react";
import { FaUserPlus } from "react-icons/fa";
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
    <Popover content={content} trigger="click" placement="bottom">
      <div className="relative cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100">
        <FaUserPlus />
        {pendingInvitations.length > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
            <span className="text-xs text-white">
              {pendingInvitations.length}
            </span>
          </span>
        )}
      </div>
    </Popover>
  );
};

export default ProjectInvitationsPopover;
