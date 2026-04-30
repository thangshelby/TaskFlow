import React, { lazy, useState, useTransition } from "react";
import { LuBell } from "react-icons/lu";
import { Popover } from "antd";

import { useNotificationContext } from "@libs/app/context/notification.context";
const NotificationList = lazy(
  () => import("@libs/app/components/notifications/notificationList"),
);

const NotificationsPopover: React.FC = () => {
  const { unreadCount } = useNotificationContext();
  const [, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      content={<NotificationList />}
      trigger="click"
      open={isOpen}
      onOpenChange={(open) => {
        startTransition(() => {
          setIsOpen(open);
        });
      }}
      placement="bottomRight"
    >
      <div
        className={`relative cursor-pointer rounded-lg p-2 transition-colors duration-150 ${
          isOpen
            ? "bg-[#064e3b]/10 text-[#064e3b]"
            : "text-[#404944] hover:bg-[#064e3b]/8 hover:text-[#064e3b]"
        }`}
        aria-label="Notifications"
      >
        <LuBell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#064e3b] shadow-sm">
            <span className="text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default NotificationsPopover;
