import React from "react";
import { LuBell } from "react-icons/lu";
import {
  getNotificationIcon,
  getNotificationTypeLabel,
  renderNotificationCard,
} from "@libs/app/components/notifications/notificationCard";
import { useNotificationContext } from "@libs/app/context/notification.context";

const NotificationList: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAsReadAll } =
    useNotificationContext();

  const formatDate = React.useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 60) {
        return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
      } else if (diffInDays < 7) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn("Error parsing date:", dateString, error);
      return "Invalid date";
    }
  }, []);

  return (
    <div className="m-[-8px] max-h-[580px] w-[420px] overflow-hidden rounded-lg border border-[#e8e8e7] bg-[#f9f9f8] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e8e8e7] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <LuBell className="h-4 w-4 text-[#064e3b]" />
          <h3 className="font-semibold text-[#1a1c1c]" style={{ fontFamily: "Manrope, sans-serif" }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#064e3b] px-2 py-0.5 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAsReadAll()}
            className="cursor-pointer rounded px-2 py-1 text-xs font-medium text-[#064e3b] transition-colors hover:bg-[#064e3b]/8 hover:text-[#003527]"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="custom-scrollbar max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#064e3b]/8">
              <LuBell className="h-7 w-7 text-[#064e3b]/50" />
            </div>
            <p className="text-sm font-medium text-[#1a1c1c]/60">No notifications yet</p>
            <p className="mt-1 text-xs text-[#404944]/60">You're all caught up!</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification, idx) => (
              <div
                key={notification.id}
                className={`group relative cursor-pointer transition-colors duration-150 ${
                  !notification.is_read
                    ? "border-l-[3px] border-l-[#064e3b] bg-[#064e3b]/5 hover:bg-[#064e3b]/8"
                    : "border-l-[3px] border-l-transparent hover:bg-[#e8e8e7]/60"
                } ${idx !== 0 ? "border-t border-t-[#e8e8e7]" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  {/* Icon */}
                  <div className="mt-0.5 flex-shrink-0 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-[#e8e8e7]">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5">
                      <span className="text-[10px] font-semibold tracking-widest text-[#064e3b] uppercase">
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                    </div>

                    <div
                      className={`mb-1 text-[13px] leading-snug text-[#1a1c1c] ${
                        !notification.is_read ? "font-medium" : "font-normal"
                      }`}
                    >
                      {renderNotificationCard(notification)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#404944]/70">
                        {formatDate(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#064e3b]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[#e8e8e7] bg-white px-4 py-2 text-center">
          <span className="text-[11px] text-[#404944]/60">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""} total
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
