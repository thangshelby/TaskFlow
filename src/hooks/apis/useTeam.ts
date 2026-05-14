import { useMutation, useQuery } from "@tanstack/react-query";
import { teams } from "@libs/apis/team";
import { CreateTeamParams, UpdateTeamParams } from "@libs/types/team";
import { toast } from "react-toastify";
import { queryClient } from "@libs/apis/react-query";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeamStore } from "@libs/store/useProjectStore";

export const useProjectTeams = (projectId: string, isFetch?: boolean) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["teams", projectId],
    queryFn: async () => {
      const { data } = await teams.getAll(projectId);
      return data;
    },
    enabled: !!projectId && (isFetch ?? true),
  });
  return {
    teams: data?.data,

    isLoading,
    error,
  };
};
export const useProjectTeamById = (projectId: string, teamId: string) => {
  const {
    data: team,
    isLoading: isLoadingTeam,
    error,
  } = useQuery({
    queryKey: ["team", projectId, teamId],
    queryFn: async () => {
      const { data } = await teams.getById(projectId, teamId);
      return data;
    },
    enabled: !!projectId && !!teamId,
  });
  return {
    team,
    isLoadingTeam,
    error,
  };
};

export const useCreateTeam = () => {
  const {
    mutate: createTeam,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (data: CreateTeamParams) => {
      const res = await teams.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Team created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["teams", data.data.project_id],
      });
    },
    onError: () => {
      toast.error("Failed to create team");
    },
  });
  return {
    createTeam,
    isLoading,
    isSuccess,
    error,
  };
};

export const useUpdateTeam = (projectId: string) => {
  const {
    mutate: updateTeam,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (newData: UpdateTeamParams) => {
      const { data } = await teams.update(projectId, newData.team_id, newData);
      return data.data;
    },
    onSuccess: (data) => {
      toast.success("Team updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["team", data.project_id, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams", data.project_id],
      });
    },
    onError: () => {
      toast.error("Failed to update team");
    },
  });
  return { updateTeam, isLoading, isSuccess, error };
};

export function useUserTeams(
  projectId: string,
  userId: string,
  enabled?: boolean,
) {
  const { setUser, user } = useAuthStore();
  const { setUserTeams } = useUserTeamStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userTeam", projectId, userId],
    queryFn: async () => {
      const { data } = await teams.getUserTeam(projectId, userId);

      const projectPermission = data?.data
        .map((team) => team.permission_keys)
        .flat();
      if (projectPermission.length > 0) {
        setUser({
          ...user!,
          projectPermission: projectPermission,
        });
      }
      setUserTeams(data?.data);
      return data;
    },
    enabled: !!projectId && !!userId && (enabled ?? true),
  });
  return {
    userTeams: data?.data,
    isLoading,
    error,
  };
}
