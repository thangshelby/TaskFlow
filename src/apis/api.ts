import axios from "axios";

// const url = "http://localhost:8081";
// const url = "http://13.229.99.156:8081";
// const url =
// "http://taskflow-main-alb-1119461494.ap-southeast-1.elb.amazonaws.com";
const url = "https://backend.taskkfloww.shop";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${url}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
      // window.location.href = "/auth/login";
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
