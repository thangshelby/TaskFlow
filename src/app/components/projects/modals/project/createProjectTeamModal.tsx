import { useRef, useState } from "react";
import Modal from "@libs/app/components/general-components/modal/modal";
import FindUser from "@libs/app/components/general-components/findUser";
import { useCreateTeam } from "@libs/hooks/apis/useTeam";
import { useParams } from "react-router-dom";

interface CreateProjectTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectTeamModal = ({
  isOpen,
  onClose,
}: CreateProjectTeamModalProps) => {
  const [name, setName] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { projectId } = useParams<{ projectId: string }>();

  const { createTeam, isLoading } = useCreateTeam();
  const handleCreateTeam = () => {
    createTeam({
      project_id: projectId || "",
      name: name.trim(),
      member_ids: memberIds,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create team"
      onClose={() => {
        onClose();
      }}
      isLoadingButton={isLoading}
      buttonContent="Create"
      onSubmit={handleCreateTeam}
      isSubmitDisabled={!name.trim()}
    >
      <div className="space-y-4" ref={wrapperRef}>
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-green-400 focus:outline-none"
            placeholder="Team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Members */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Add team members <span className="text-red-500">*</span>
          </label>
          <FindUser value={memberIds} onChange={setMemberIds} />
        </div>

        {/* Membership controls */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Membership controls
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={anyoneCanJoin}
              onChange={(e) => setAnyoneCanJoin(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Anyone can join this team without approval
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectTeamModal;
