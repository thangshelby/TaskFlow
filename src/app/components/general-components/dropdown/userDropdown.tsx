import ColumnDropdown from "./columnDropdown";
import { IProjectMember } from "@libs/types/projectMember";
import UserAvatar from "../user/userAvatar";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import React, { memo, useState } from "react";

const UserDropdown = ({
  projectId,
  issueId,
  selectedUserId,
  columnField,
  isDisplayname = true,
  isEditable = true,
}: {
  projectId: string;
  issueId: string;
  selectedUserId: string;
  columnField: string;
  isDisplayname?: boolean;
  isEditable?: boolean;
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
  // Create items array with proper null checks
  const items = React.useMemo(() => {
    if (!projectMembers || !Array.isArray(projectMembers)) {
      return [
        {
          value: "Unassigned",
          key: "Unassigned",
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: (
            <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
              <UserAvatar userId={""} isDisplayName={true} />
            </div>
          ),
          onClick: () => {
            handleChangeUser("");
          },
        },
      ];
    }

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
        <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
          <UserAvatar userId={member.user_id} isDisplayName={true} />
        </div>
      ),
      onClick: () => {
        handleChangeUser(member.user_id);
      },
    }));

    return [
      ...memberItems,
      {
        value: "Unassigned",
        key: "Unassigned",
        style: {
          padding: 0,
          background: "white",
          border: "none",
          boxShadow: "none",
        },
        label: (
          <div className="border-l-2 border-transparent p-2 hover:border-emerald-600 hover:bg-gray-200">
            <UserAvatar userId={""} isDisplayName={true} />
          </div>
        ),
        onClick: () => {
          handleChangeUser("");
        },
      },
    ];
  }, [projectMembers]);

  return (
    <ColumnDropdown
      isOpen={isOpenDropdown}
      setIsOpenDropdown={(isOpen) => {
        setIsOpenDropdown(isOpen);
      }}
      disabled={!isEditable}
      items={items}
      children={
        <UserAvatar
          userId={selectedUserId || ""}
          isDisplayName={isDisplayname}
        />
      }
      isLoading={isLoading}
    />
  );
};

export default memo(UserDropdown);
