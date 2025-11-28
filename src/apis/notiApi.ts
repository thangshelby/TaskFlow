import { io, Socket } from "socket.io-client";
import axios from "axios";

const NOTIFICATION_URL_API =
  import.meta.env.VITE_NOTISERVICE_API_URL || "http://localhost:5002/api/v1/";

const NOTIFICATION_URL_WEBSOCKET =
  import.meta.env.VITE_NOTISERVICE_API_URL?.replace("/api/v1/", "") ||
  "http://localhost:5002";

const notiApi = axios.create({
  baseURL: NOTIFICATION_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
notiApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
notiApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const connectSocket = (userId: string): Socket => {
  const socket = io(NOTIFICATION_URL_WEBSOCKET, {
    query: { userId },
    transports: ["websocket"],
    path: "/socket.io",
  });

  socket.on("connect", () => {
    // console.log("✅ Connected to server:", socket.id);
  });

  socket.on("disconnect", () => {
    // console.log("❌ Disconnected from server");
  });

  return socket;
};
export default notiApi;
