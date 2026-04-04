import { FaCheck } from "react-icons/fa6";
import { Popover } from "antd";
import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
interface Option {
  label: string;
  value: string;
  icon?: ReactNode;
  customRender?: ReactNode;
}
interface DropDownProps {
  options: Option[];
  parent: ReactNode;
  onClickItem?: (option: Option) => void;
  menuClassName?: string;
  rowClassName?: string;
  className?: string;
  value?: Option;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  isShowIcon?: boolean;
}
export default function DropdownAntd({
  options,
  parent,
  onClickItem,
  value,
  menuClassName,
  className,
  rowClassName,
  placement = "bottomRight",
  open: controlledOpen,
  onOpenChange,
  isShowIcon = true,
}: DropDownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const dropDownOpt = () => {
    return (
      <div className={` ${menuClassName}`}>
        {options.map((option, idx) => (
          <div
            onClick={() => {
              if (isControlled) {
                onOpenChange && onOpenChange(false);
              } else {
                setUncontrolledOpen(false);
              }
              if (onClickItem) onClickItem(option);
            }}
            key={idx}
            className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 transition-all hover:bg-gray-200 ${rowClassName}`}
          >
            {option?.icon && (
              <div className="flex min-w-[20px] items-center justify-center">
                {option.icon}
              </div>
            )}
            {value && value.value === option.value && (
              <FaCheck className="h-5 w-5" />
            )}
            <div className="">
              {option.customRender ? option.customRender : option.label}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="dropdown-ct">
      <Popover
        content={() => dropDownOpt()}
        trigger="click"
        arrow={false}
        className="w-full"
        placement={placement}
        open={open}
        onOpenChange={(bool) => {
          if (isControlled) {
            onOpenChange && onOpenChange(bool);
          } else {
            setUncontrolledOpen(bool);
          }
        }}
      >
        <div
          className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md ${isShowIcon && "border border-gray-300 px-3 py-2"} ${className}`}
        >
          <div className="w-full text-sm font-semibold text-[#333]">
            {parent}
          </div>
          {isShowIcon && <FaChevronDown className="text-gray-500" />}
        </div>
      </Popover>
    </div>
  );
}
