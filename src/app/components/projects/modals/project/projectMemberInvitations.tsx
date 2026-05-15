import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { projectMembers } from "@libs/apis/projectMember";
import { IProjectMember } from "@libs/types/projectMember";
import { Check, X } from "lucide-react";
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
    return <div className="p-4 text-center text-sm text-[#404944]">Loading invitations...</div>;
  }

  if (!pendingMemberships.length) {
    return <div className="p-6 text-center text-sm text-[#404944] font-medium">No pending invitations</div>;
  }

  return (
    <div className="w-[320px] max-h-[400px] overflow-y-auto">
      <div className="p-4 border-b border-[#e8e8e7] bg-[#f9f9f8]">
        <h3 className="text-sm font-bold text-[#064e3b]">
          Project Invitations
        </h3>
      </div>
      <div className="p-2 space-y-2">
        {pendingMemberships.map((member: IProjectMember) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-xl bg-white border border-[#e8e8e7] p-3 hover:border-[#064e3b]/30 transition-all shadow-sm"
          >
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-bold text-[#404944] truncate">{member.project.name}</p>
              <p className="text-[11px] text-[#404944]/60 font-medium">Role: {member.role}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() =>
                  acceptInvitationMutation.mutate({
                    projectId: member.project_id,
                    userId,
                  })
                }
                disabled={acceptInvitationMutation.isPending}
                className="cursor-pointer rounded-lg p-2 text-white bg-[#064e3b] hover:opacity-90 active:scale-95 transition-all shadow-sm"
                title="Accept"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button
                onClick={() =>
                  rejectInvitationMutation.mutate({
                    projectId: member.project_id,
                    userId,
                  })
                }
                disabled={rejectInvitationMutation.isPending}
                className="cursor-pointer rounded-lg p-2 text-[#404944] bg-white border border-[#e8e8e7] hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all"
                title="Reject"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMemberInvitations;
