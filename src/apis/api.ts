import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export interface ResponseApi<T> {
  status: string;
  message: string;
  data: T;
  pagination?: PaginationRes;
}
export interface PaginationRes {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}
export default api;
