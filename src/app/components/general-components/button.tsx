import React, { ReactNode } from "react";
import { LuLoader } from "react-icons/lu"; // optional spinner icon from lucide-react
import { Tooltip } from "antd";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "light"
  | "primary-outline"
  | "secondary-outline"
  | "primary-light"
  | "secondary-light"
  | "outline"; // Added 'outline' variant

interface ButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const variantStyles = {
  primary:
    "bg-[#064e3b] text-white shadow-[0_4px_14px_0_rgba(6,78,59,0.39)] hover:bg-[#0b513d] hover:shadow-[0_6px_20px_rgba(11,81,61,0.23)] active:scale-95",
  secondary: "border border-[#e8e8e7] bg-white text-[#064e3b] hover:bg-[#f9f9f8] hover:border-[#064e3b]/30 active:bg-gray-100",
  dark: "bg-[#111827] text-white hover:bg-black active:scale-95",
  light: "bg-[#f9f9f8] text-[#064e3b] border border-[#e8e8e7] hover:bg-[#f0fdf4] hover:border-[#064e3b]/20",
  "primary-outline":
    "border-2 border-[#064e3b] text-[#064e3b] hover:bg-[#f0fdf4] active:bg-[#dcfce7]",
  "secondary-outline":
    "border-2 border-[#404944]/20 text-[#404944]/70 hover:bg-gray-50 hover:border-[#404944]/40",
  "primary-light": "bg-[#f0fdf4] text-[#064e3b] hover:bg-[#dcfce7]",
  "secondary-light": "bg-[#f9f9f8] text-gray-600 hover:bg-gray-100",
  outline: "border border-[#cccbc8] bg-[#fcfcfb] text-[#064e3b] hover:border-[#064e3b] hover:bg-[#f0fdf4] shadow-sm",
};

const sizeStyles = {
  xs: "px-2 py-1 text-[10px] tracking-wider rounded-xs",
  sm: "px-3 py-1.5 text-[10px] tracking-wider rounded-sm",
  md: "px-4 py-2 text-[12px] tracking-widest rounded-md",
  lg: "px-6 py-3 text-[13px] tracking-widest rounded-lg",
  xl: "px-8 py-4 text-[14px] tracking-widest rounded-xl",
};

const Button = ({
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  title,
  disabled = false,
  isLoading = false,
  type = "button",
}: ButtonProps): React.ReactElement => {
  const baseStyles =
    "transition-all duration-200 font-bold outline-none ring-[#064e3b]/50 focus:ring-2 focus:ring-offset-2 select-none flex items-center justify-center gap-2 font-manrope uppercase";

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const disabledStyles =
    disabled || isLoading ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";

  return (
    <Tooltip title={title}>
      <button
        role="button"
        type={type}
        tabIndex={disabled || isLoading ? -1 : 0}
        onClick={!(disabled || isLoading) ? onClick : undefined}
        aria-disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${disabledStyles} ${className} `}
        onKeyDown={(e) => {
          if (
            !(disabled || isLoading) &&
            (e.key === "Enter" || e.key === " ")
          ) {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {isLoading && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
        {isLoading ? "Loading..." : children}
      </button>
    </Tooltip>
  );
};


export default Button;
