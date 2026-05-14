import { INotification, NotificationType } from "@libs/types/notification";
import { JSX } from "react";
import {
  LuBell,
  LuCalendar,
  LuFolderOpen,
  LuGroup,
  LuMessageCircle,
  LuRocket,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { TbAlertTriangle } from "react-icons/tb";

// Theme-consistent accent colors (muted, on-brand)
const accentText = "font-semibold text-[#064e3b]";
const mutedText = "text-[#1a1c1c]";
const subtleText = "text-[#404944]";

const renderNotificationCard = (notification: INotification): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refData = notification.reference_data as any;
  const { type } = notification;

  switch (type) {
    case NotificationType.ASSIGNMENT:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {notification.actor?.first_name +
              " " +
              notification.actor?.last_name || "Someone"}
          </span>
          {" assigned you to "}
          <span className={accentText}>
            {refData?.title || notification.reference_id}
          </span>
        </div>
      );

    case NotificationType.MENTION:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData?.actorName || "Someone"}
          </span>
          {" mentioned you in "}
          <span className="font-medium text-[#1a1c1c]">
            {refData?.issueKey || notification.reference_id}
          </span>
          {refData?.commentText && (
            <div className={`mt-1 text-xs italic ${subtleText}`}>
              "
              {refData?.commentText.length > 100
                ? refData?.commentText.substring(0, 100) + "..."
                : refData?.commentText}
              "
            </div>
          )}
        </div>
      );

    case NotificationType.COMMENT:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" commented on "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.issueKey || notification.reference_id}
          </span>
          {refData.commentText && (
            <div className={`mt-1 text-xs italic ${subtleText}`}>
              "
              {refData.commentText.length > 100
                ? refData.commentText.substring(0, 100) + "..."
                : refData.commentText}
              "
            </div>
          )}
        </div>
      );

    case NotificationType.STATUS_UPDATE:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" moved "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.issueKey || notification.reference_id}
          </span>
          {" from "}
          <span className="inline-flex items-center rounded bg-[#e8e8e7] px-1.5 py-0.5 text-[11px] font-medium text-[#404944]">
            {refData.oldStatus || "Unknown"}
          </span>
          {" to "}
          <span className="inline-flex items-center rounded bg-[#064e3b]/12 px-1.5 py-0.5 text-[11px] font-medium text-[#064e3b]">
            {refData.newStatus || "Unknown"}
          </span>
        </div>
      );

    case NotificationType.DUE_DATE_REMINDER: {
      const dueDate = refData.dueDate ? new Date(refData.dueDate) : null;
      const isOverdue = dueDate && dueDate < new Date();
      return (
        <div className={mutedText}>
          <span className={`font-semibold ${isOverdue ? "text-[#ba1a1a]" : "text-[#064e3b]"}`}>
            {refData.issueKey || notification.reference_id}
          </span>
          {isOverdue ? " is overdue!" : " is due soon"}
          {dueDate && (
            <div className={`mt-0.5 text-xs ${subtleText}`}>
              Due: {dueDate.toLocaleDateString()}
            </div>
          )}
          {refData.issueTitle && (
            <div className={`text-xs ${subtleText}`}>"{refData.issueTitle}"</div>
          )}
        </div>
      );
    }

    case NotificationType.PROJECT_INVITATION:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" invited you to join "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.projectName || "a project"}
          </span>
          {refData.role && (
            <div className={`mt-0.5 text-xs ${subtleText}`}>
              Role: <span className="font-medium text-[#064e3b]">{refData.role}</span>
            </div>
          )}
        </div>
      );

    case NotificationType.REACTION:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" reacted "}
          <span className="text-base">{refData.reaction || "👍"}</span>
          {" to your comment on "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.issueKey || notification.reference_id}
          </span>
        </div>
      );

    case NotificationType.SPRINT_STARTED:
      return (
        <div className={mutedText}>
          <span className={accentText}>Sprint started:</span>{" "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.sprintName || "Sprint"}
          </span>
          {refData.projectName && (
            <div className={`mt-0.5 text-xs ${subtleText}`}>
              Project: {refData.projectName}
            </div>
          )}
        </div>
      );

    case NotificationType.PROJECT_ADDED:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" added you to "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.projectName || "a project"}
          </span>
          {refData.role && (
            <div className={`mt-0.5 text-xs ${subtleText}`}>
              Role: <span className="font-medium text-[#064e3b]">{refData.role}</span>
            </div>
          )}
        </div>
      );

    case NotificationType.PROJECT_TEAM_ADDED:
      return (
        <div className={mutedText}>
          <span className={accentText}>
            {refData.actorName || "Someone"}
          </span>
          {" added you to the team of "}
          <span className="font-medium text-[#1a1c1c]">
            {refData.projectName || "a project"}
          </span>
        </div>
      );

    case NotificationType.SYSTEM_ALERT:
      return (
        <div className={mutedText}>
          <span className="font-semibold text-[#404944]">System Alert:</span>{" "}
          <span className="text-[#1a1c1c]">
            {refData.message || notification.content}
          </span>
          {refData.severity && (
            <div
              className={`mt-0.5 text-xs font-semibold ${
                refData.severity === "high"
                  ? "text-[#ba1a1a]"
                  : refData.severity === "medium"
                    ? "text-amber-600"
                    : "text-[#064e3b]"
              }`}
            >
              Severity: {refData.severity.toUpperCase()}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-[#1a1c1c]">{notification.content}</div>
      );
  }
};

const getNotificationTypeLabel = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ASSIGNMENT:
      return "Assignment";
    case NotificationType.MENTION:
      return "Mention";
    case NotificationType.COMMENT:
      return "Comment";
    case NotificationType.STATUS_UPDATE:
      return "Status Update";
    case NotificationType.DUE_DATE_REMINDER:
      return "Due Date";
    case NotificationType.PROJECT_INVITATION:
      return "Project Invitation";
    case NotificationType.SPRINT_STARTED:
      return "Sprint Started";
    case NotificationType.PROJECT_ADDED:
      return "Project Added";
    case NotificationType.PROJECT_TEAM_ADDED:
      return "Team Added";
    case NotificationType.SYSTEM_ALERT:
      return "System Alert";
    default:
      return "Notification";
  }
};

// All icons use emerald theme color
const getNotificationIcon = (type: NotificationType) => {
  const cls = "h-3.5 w-3.5 text-[#064e3b]";
  switch (type) {
    case NotificationType.ASSIGNMENT:
      return <LuUser className={cls} />;
    case NotificationType.MENTION:
      return <LuBell className={cls} />;
    case NotificationType.COMMENT:
      return <LuMessageCircle className={cls} />;
    case NotificationType.STATUS_UPDATE:
      return <TbAlertTriangle className={cls} />;
    case NotificationType.DUE_DATE_REMINDER:
      return <LuCalendar className="h-3.5 w-3.5 text-[#ba1a1a]" />;
    case NotificationType.PROJECT_INVITATION:
      return <LuFolderOpen className={cls} />;
    case NotificationType.SPRINT_STARTED:
      return <LuRocket className={cls} />;
    case NotificationType.PROJECT_ADDED:
    case NotificationType.PROJECT_TEAM_ADDED:
      return <LuGroup className={cls} />;
    case NotificationType.SYSTEM_ALERT:
      return <LuSettings className="h-3.5 w-3.5 text-[#404944]" />;
    default:
      return <LuBell className={cls} />;
  }
};

export {
  renderNotificationCard,
  getNotificationIcon,
  getNotificationTypeLabel,
};
