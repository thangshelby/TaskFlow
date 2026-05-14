import { ResponseApi } from "@libs/apis/api";
import notiApi from "@libs/apis/notiApi";
import { INotification } from "@libs/types/notification";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const notificationApi = {
  list: (userId: string) =>
    notiApi.post<ResponseApi<INotification[]>>(
      `/get-all`,
      { user_id: userId },
      config,
    ),

  update: (notificationId: string, body: { isRead: boolean }) =>
    notiApi.put<ResponseApi<INotification>>(
      `/${notificationId}`,
      body,
      config,
    ),

  updateAll: (body: { userId: string; isRead: boolean }) =>
    notiApi.post<ResponseApi<void>>(`/update-all`, body, config),

  getUnreadCount: () =>
    notiApi.get<ResponseApi<{ count: number }>>(
      `/unread-count`,
      config,
    ),

  delete: (notificationId: string) =>
    notiApi.delete<ResponseApi<void>>(
      `/${notificationId}`,
      config,
    ),
};
