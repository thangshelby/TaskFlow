import ColumnDropdown from "./columnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import UserAvatar from "../user/userAvatar";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import React, { memo, useState } from "react";
import { IUser } from "@libs/types/user";

const UserDropdown = ({
  projectId,
  issueId,
  selectedUserId,
  columnField,
  isDisplayname = true,
  isEditable = true,
  user,
  size = "small",
}: {
  projectId: string;
  issueId: string;
  selectedUserId: string;
  columnField: string;
  isDisplayname?: boolean;
  isEditable?: boolean;
  user?: IUser;
  size?: number | "small" | "medium" | "large";
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const { projectMembers, isLoading } = useProjectMembers(
    { project_id: projectId },
    isOpenDropdown,
  );

  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeUser = (userId: string) => {
    updateIssueAsync({ id: issueId, data: { [columnField]: userId } });
  };
  const unassignedItem = {
    value: "Unassigned",
    key: "Unassigned",
    style: {
      padding: 0,
      background: "white",
      border: "none",
      boxShadow: "none",
    },
    label: (
      <div className="border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 font-manrope">
        <UserAvatar userId={""} isDisplayName={true} />
      </div>
    ),
    onClick: () => {
      handleChangeUser("");
    },
  };
  // Create items array with proper null checks
  const items = React.useMemo(() => {
    // If no project members, return unassigned item
    if (!projectMembers || !Array.isArray(projectMembers)) {
      return [
        {
          ...unassignedItem,
        },
      ];
    }

    // If project members, return member items
    const memberItems = projectMembers.map((member: IProjectMember) => ({
      value:
        `${member.user?.first_name || ""} ${member.user?.last_name || ""}`.trim(),
      key: member.user_id,
      style: {
        padding: 0,
        background: "white",
        border: "none",
        boxShadow: "none",
      },
      label: (
        <div className="border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200 font-manrope">
          <UserAvatar userId={member.user_id} isDisplayName={true} />
        </div>
      ),
      onClick: () => {
        handleChangeUser(member.user_id);
      },
    }));

    return [
      ...memberItems,
      unassignedItem,
    ];

  }, [projectMembers, size]);

  return (
    <ColumnDropdown
      isOpen={isOpenDropdown}
      setIsOpenDropdown={setIsOpenDropdown}
      disabled={!isEditable}
      items={items}
      children={
        <UserAvatar
          userId={selectedUserId || ""}
          isDisplayName={isDisplayname}
          user={user}
        />
      }
      isLoading={isLoading}
    />
  );
};

export default memo(UserDropdown);
