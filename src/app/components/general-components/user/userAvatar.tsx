import { memo } from "react";
import { Avatar } from "antd";
import { FaUserAltSlash } from "react-icons/fa";
import { useUserById } from "@libs/hooks/apis/useUser";
import { IUser } from "@libs/types/user";

type Props = {
  userId?: string;
  size?: number;
  isDisplayName?: boolean;
  className?: string;
  borderRadius?: string;
  user?: IUser
};

function buildCloudinaryUrl(url: string, size: number) {
  if (!url) return "";
  // Chèn transform Cloudinary vào (w,h,c_fill,f_auto,q_auto)
  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`,
  );
}

const UserAvatar = memo(
  ({ userId, size = 28, isDisplayName = true, className, borderRadius, user: defaultUser }: Props) => {
    const { user: fetchedUser } = useUserById(userId || "", !defaultUser);
    const displayUser = defaultUser ?? fetchedUser ?? null;

    if (!userId && !defaultUser) {
      return (
        <div className="flex flex-row items-center justify-start gap-2 font-manrope">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8e8e7] border border-white">
            <FaUserAltSlash size={10} className="text-[#404944]/80" />
          </div>
          {isDisplayName && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#404944]/80">
              Unassigned
            </span>
          )}
        </div>
      );
    }

    const avatarUrl = displayUser?.avatar ? buildCloudinaryUrl(displayUser.avatar, size) : "";

    return (
      <div className={`flex flex-row items-center gap-2 font-manrope ${className}`}>
        <Avatar
          size={size}
          src={
            avatarUrl ? (
              <img
                src={avatarUrl}
                srcSet={`
                ${buildCloudinaryUrl(displayUser?.avatar || "", size)} 1x,
                ${buildCloudinaryUrl(displayUser?.avatar || "", size * 2)} 2x
              `}
                alt={`user avatar`}
                loading="lazy"
              />
            ) : undefined
          }
          style={{
            backgroundColor: "#064e3b",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${Math.floor(size / 2.5)}px`,
            fontWeight: 800,
            textTransform: "uppercase",
            border: "2px solid white",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            borderRadius: borderRadius ? borderRadius : "100%",
          }}
        >
          {displayUser?.first_name?.[0]}
          {displayUser?.last_name?.[0]}
        </Avatar>

        {isDisplayName && (
          <p className="text-xs font-bold text-[#404944] tracking-tight">
            {displayUser?.first_name} {displayUser?.last_name}
          </p>
        )}
      </div>

    );
  },
);

export default UserAvatar;
