import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:8081";
const api = axios.create({
  baseURL: `${url}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (window.location.pathname.startsWith("/admin")) {
      const adminToken = localStorage.getItem("admin_token");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith("/admin")) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("token");
        // window.location.href = "/auth/login";
      }
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
