import { Tooltip } from "antd";
import { useAuthStore } from "@libs/store/useAuthStore";
import { usePermission } from "@libs/hooks/common/usePermission";
import { IUser } from "@libs/types/user";
import { PermissionResource } from "@libs/hooks/common/usePermission";

export const PermissionButton = ({
  title,
  action,
  children,
  resource,
  handleClick,
}: {
  title?: string;
  action: string;
  children: React.ReactNode;
  resource?: PermissionResource;
  handleClick?: () => void;
}) => {
  const { user } = useAuthStore();
  const { isAllow, message } = usePermission({
    user: user as IUser,
    action: action,
    resource: resource,
  });
  return (
    <Tooltip
      placement="top"
      trigger={["hover"]}
      title={message || title}
    >
      <span
        onClick={isAllow ? handleClick : undefined}
        className={`inline-flex ${isAllow ? "cursor-pointer" : "cursor-not-allowed opacity-50 pointer-events-none"}`}
        aria-label={title}
        role="button"
        aria-disabled={!isAllow}
        tabIndex={isAllow ? 0 : -1}
        onKeyDown={isAllow ? (e) => e.key === "Enter" && handleClick?.() : undefined}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default PermissionButton;
