import { projectMembers } from "@libs/apis/projectMember";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddProjectMemberParams,
  AddProjectMemberToTeamParams,
  ListProjectMemberParams,
} from "@libs/types/projectMember";
import { toast } from "react-toastify";

export function useProjectMembers(
  params: ListProjectMemberParams,
  enabled?: boolean,
) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectMembers", params.project_id, params.page, params.limit],
    queryFn: async () => {
      const res = await projectMembers.list(params);
      // put each user into the user cache
      res.data.data.forEach((u) => {
        queryClient.setQueryData(["user", u.id], u);
      });

      const response = res.data;

      return response;
    },
    enabled: !!params.project_id && (enabled === undefined ? true : enabled),
  });
  return {
    projectMembers: data?.data,
    pagination: data?.pagination,
    isLoading,
    error,
  };
}
export function useUserMemberships(userId: string, enabled?: boolean) {
  const {
    data: membershipsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-memberships", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      return projectMembers.getUserMemberships(userId);
    },
    enabled: (!!userId && enabled) ?? true,
  });

  return {
    memberships: membershipsData?.data.data || [],
    pagination: membershipsData?.data.pagination,
    isLoading,
    error,
  };
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();
  const {
    mutate: addProjectMember,
    mutateAsync: addProjectMemberAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: AddProjectMemberParams) => {
      return projectMembers.add(data);
    },
    onSuccess: () => {
      toast.success("Project member added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add project member");
    },
  });

  return {
    addProjectMember,
    addProjectMemberAsync,
    isLoading,
    isSuccess,
    error,
  };
}

export function useAddProjectMemberToTeam() {
  const {
    mutate: addProjectMemberToTeam,
    mutateAsync: addProjectMemberToTeamAsync,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: AddProjectMemberToTeamParams) => {
      return projectMembers.addMembersToTeam(data);
    },
    onSuccess: () => {
      toast.success("Project member added to team successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add project member to team");
    },
  });
  return {
    addProjectMemberToTeam,
    addProjectMemberToTeamAsync,
    isLoading,
    isSuccess,
    error,
  };
}

export function useListProjectMembers(project_id: string) {
  const queryClient = useQueryClient();
  const {
    data: projectMembersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projectMembers", project_id],
    queryFn: async () => {
      const res = await projectMembers.list({
        project_id,
      });
      // put each user into the user cache
      res.data.data.forEach((user) => {
        queryClient.setQueryData(["user", user.id], user);
      });

      return res;
    },
  });

  return {
    projectMembers: projectMembersData?.data?.data || [],
    pagination: projectMembersData?.data?.pagination,
    isLoading,
    error,
  };
}
