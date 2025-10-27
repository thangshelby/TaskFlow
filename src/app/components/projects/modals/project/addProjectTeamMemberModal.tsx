import Modal from "@libs/app/components/general-components/modal/modal";
import { useState } from "react";
import FindUser from "@libs/app/components/general-components/findUser";
import { useAddProjectMemberToTeam } from "@libs/hooks/apis/useProjectMember";
interface AddProjectTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  teamId: string;
  excludeUserIds: string[];
}

const AddProjectTeamMemberModal = ({
  isOpen,
  onClose,
  projectId,
  teamId,
  excludeUserIds,
}: AddProjectTeamMemberModalProps) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { addProjectMemberToTeam, isLoading } = useAddProjectMemberToTeam();

  const handleAddProjectMemberToTeam = () => {
    addProjectMemberToTeam({
      project_id: projectId,
      team_id: teamId,
      user_ids: selectedUserIds,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add people to team"
      onClose={onClose}
      isLoadingButton={isLoading}
      buttonContent="Add"
      onSubmit={handleAddProjectMemberToTeam}
      isSubmitDisabled={selectedUserIds.length === 0}
    >
      <div className="flex max-w-md flex-col gap-4">
        <p className="text-sm text-gray-500">
          Grow your team and work better together. Adding people to this team
          gives them access to all the team’s work. What is an Atlassian team?﻿
        </p>
        <div>
          <FindUser
            value={selectedUserIds}
            onChange={setSelectedUserIds}
            label="Select members"
            className="mt-2"
            excludeUserIds={excludeUserIds}
          />
          <span className="text-sm text-gray-500">
            {selectedUserIds.length} members added
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default AddProjectTeamMemberModal;
