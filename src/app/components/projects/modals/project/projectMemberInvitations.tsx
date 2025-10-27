import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { projectMembers } from "@libs/apis/projectMember";
import { IProjectMember } from "@libs/types/projectMember";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUserMemberships } from "@libs/hooks/apis/useProjectMember";

interface ProjectMemberInvitationsProps {
  userId: string;
}

const ProjectMemberInvitations: React.FC<ProjectMemberInvitationsProps> = ({
  userId,
}) => {
  const queryClient = useQueryClient();

  const { memberships, isLoading } = useUserMemberships(userId);
  const pendingMemberships = memberships.filter(
    (member: IProjectMember) => member.is_pending,
  );

  const acceptInvitationMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: string; userId: string }) =>
      projectMembers.acceptInvitation(projectId),
    onSuccess: () => {
      toast.success("Project invitation accepted");
      queryClient.invalidateQueries({ queryKey: ["user-memberships"] });
    },
    onError: () => {
      toast.error("Failed to accept invitation");
    },
  });

  const rejectInvitationMutation = useMutation({
    mutationFn: ({ projectId }: { projectId: string; userId: string }) =>
      projectMembers.rejectInvitation(projectId),
    onSuccess: () => {
      toast.success("Project invitation rejected");
      queryClient.invalidateQueries({ queryKey: ["user-memberships"] });
    },
    onError: () => {
      toast.error("Failed to reject invitation");
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading invitations...</div>;
  }

  if (!pendingMemberships.length) {
    return <div className="p-4">No pending invitations</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Invitations</h3>
      <div className="space-y-2">
        {pendingMemberships.map((member: IProjectMember) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          >
            <div>
              <p className="font-medium">{member.project.name}</p>
              <p className="text-sm text-gray-500">Role: {member.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  acceptInvitationMutation.mutate({
                    projectId: member.project_id,
                    userId,
                  })
                }
                disabled={acceptInvitationMutation.isPending}
                className="rounded-full p-2 text-green-600 hover:bg-green-50"
                title="Accept Invitation"
              >
                <FaCheck />
              </button>
              <button
                onClick={() =>
                  rejectInvitationMutation.mutate({
                    projectId: member.project_id,
                    userId,
                  })
                }
                disabled={rejectInvitationMutation.isPending}
                className="rounded-full p-2 text-red-600 hover:bg-red-50"
                title="Reject Invitation"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMemberInvitations;
