import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const elasticSearchApi = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
elasticSearchApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
elasticSearchApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default elasticSearchApi;

interface SearchRequest {
  q?: string;
  project_ids?: string[];
  assignee_ids?: string[];
  reporter_ids?: string[];
  status?: string[];
  labels?: string[];
  last_updated: string;
  created_at?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  updated_at?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  due_date?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  priority?: "low" | "medium" | "high";
  type?: "bug" | "feature" | "task";
  severity?: "low" | "medium" | "high";
  category?: "bug" | "feature" | "task";
  limit?: number;
  userId: string;
}

export const elasticSearch = {
  search: (request: SearchRequest) => {
    return elasticSearchApi.post("/search_issues", request);
  },
};

export const useElasticSearch = (request: SearchRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["elasticSearch", request],
    queryFn: async () => {
      const response = await elasticSearch.search(request);
      console.log(response);
      return response.data;
    },
  });
  return {
    issues: data,
    isLoading: isLoading,
    error: error,
  };
};
