import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { users } from "@libs/apis/user";
import { IUser } from "@libs/types/user";

export function useUserById(userId: string, enabled: boolean = true) {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data } = await users.getById(userId);
      return data.data;
    },
    enabled: !!userId && enabled,
  });
  return {
    user: userData,
    isLoading,
    error,
  };
}

export function useListUser(keyword: string, projectId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", keyword],
    queryFn: async () => {
      const { data } = await users.list(keyword, projectId);
      return data;
    },
    enabled: !!keyword,
  });
  return {
    users: data?.data,
    isLoading,
    error,
  };
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await users.getMe();
      return data;
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      old_password: string;
      new_password: string;
    }) => {
      const response = await users.changePassword(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useGetUserStats(id: string, isSprintId: boolean) {
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["userStats", id],
    queryFn: async () => {
      if (!id) throw new Error("Project/Sprint ID is required");
      const response = await users.getUserStats({
        id: id,
        is_sprintId: isSprintId,
      });
      return response.data;
    },
    enabled: !!id,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  return {
    stats: data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: {
        user_id: string;
      } & Partial<IUser>,
    ) => {
      const response = await users.updateUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

/**
 * Admin-specific hook: always fetches all users regardless of keyword.
 * Used in the Admin Portal where we always want to see the full user list.
 */
export function useAdminListUsers(keyword: string = "") {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users", keyword],
    queryFn: async () => {
      const { data } = await users.list(keyword);
      return data;
    },
    // Always enabled — admin always needs user data
    enabled: true,
    staleTime: 30_000, // 30s cache
  });
  return {
    users: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Admin delete user mutation placeholder.
 * Wire up to actual API endpoint when backend supports it.
 */
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // TODO: replace with actual admin delete endpoint
      // await api.delete(`/admin/users/${userId}`, { withCredentials: true });
      console.log("[Admin] Soft-delete user:", userId);
      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
