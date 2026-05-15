export type UISize = "small" | "medium" | "large";

export const UI_COMMON_SIZES = {
  small: {
    padding: "px-1 py-1",
    textClass: "text-[10px]",
    iconSize: 12,
    roundedClass: "rounded-sm",
  },
  medium: {
    height: "26px",
    heightClass: "h-[26px]",
    px: "px-2.5",
    padding: "0 10px",
    paddingClass: "px-2.5",
    fontSize: "11px",
    textClass: "text-[11px]",
    iconSize: 14,
    avatarSize: 26,
    borderRadius: "6px",
    roundedClass: "rounded-md",
  },
  large: {
    height: "30px",
    heightClass: "h-[30px]",
    px: "px-3",
    padding: "0 12px",
    paddingClass: "px-3",
    fontSize: "12px",
    textClass: "text-[12px]",
    iconSize: 16,
    avatarSize: 30,
    borderRadius: "6px",
    roundedClass: "rounded-md",
  },
} as const;

export const getBadgeSizeClass = (size: UISize) => {
  const config = UI_COMMON_SIZES[size];
  return `${config.padding} ${config.textClass} ${config.roundedClass}`;
};

export const getDropdownSizeClass = (size: UISize) => {
  const config = UI_COMMON_SIZES[size];
  return `${config.padding} ${config.textClass} ${config.roundedClass}`;
};
