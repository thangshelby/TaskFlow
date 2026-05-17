import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../apis/react-query";
import { auth } from "@libs/apis/auth";
import { users } from "@libs/apis/user";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, setError } = useAuthStore();
  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await auth.getCurrentUser();
      setUser(data.data);
      return data.data;
    },
    retry: false,
    enabled: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const login = useMutation({
    mutationFn: auth.login,
    onSuccess: ({ data }) => {
      setUser(data.data);
      queryClient.setQueryData(["currentUser"], data.data);
      navigate("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setError(message);
    },
  });

  const register = useMutation({
    mutationFn: auth.register,
    onSuccess: (_, variables) => {
      navigate("/auth/verify-otp", { state: { email: variables.email } });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    },
  });

  const verifyOtp = useMutation({
    mutationFn: auth.verify,
    onSuccess: ({ data }) => {
      setUser(data.data);
      queryClient.setQueryData(["currentUser"], data.data);
      navigate("/projects");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    },
  });

  const resendOtp = useMutation({
    mutationFn: auth.resend,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error.response?.data?.message || "Could not resend OTP. Please try again.");
    },
  });

  const logout = async () => {
    try {
      await auth.logout(); // Call the server to clear cookies
      localStorage.removeItem("token");
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const updateUser = useMutation({
    mutationFn: users.update,
    onSuccess: ({ data }) => {
      setUser(data.data);
      queryClient.setQueryData(["currentUser"], { data: data.data });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Update failed:", error);
    },
  });

  return {
    user: currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    updateUser: updateUser.mutate,
  };
}
