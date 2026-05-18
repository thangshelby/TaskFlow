import React from "react";
import { Check, X, Edit } from "lucide-react";
import { Tooltip } from "antd";

const CustomInput = ({
  field,
  value,
  inputType = "number",
  handleUpdateIssue,
  containerClassName,
  contentClassName,
  isEditing,
  onEditStart,
  onEditCancel,
}: {
  field: string;
  value?: string | number;
  inputType?: "text" | "number" | "date";
  handleUpdateIssue: (field: string, value: any) => void;
  containerClassName?: string;
  contentClassName?: string;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditCancel?: () => void;
}) => {
  const [internalShow, setInternalShow] = React.useState(false);
  const show = isEditing !== undefined ? isEditing : internalShow;

  const handleShow = () => {
    setInternalShow(true);
    if (onEditStart) onEditStart();
  };

  const handleClose = () => {
    setInternalShow(false);
    if (onEditCancel) onEditCancel();
  };

  const [updatedValue, setUpdatedValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div className={`relative w-full ${show ? "z-40" : ""} ${containerClassName}`}>
      {show ? (
        <input
          autoFocus
          ref={inputRef}
          type={inputType}
          onBlur={() => {
            handleClose();
            handleUpdateIssue(field, updatedValue);
          }}
          value={updatedValue ? updatedValue : value}
          onChange={(e) => setUpdatedValue(e.target.value)}
          className={`w-full rounded-sm border-2 border-[#064e3b] bg-white p-1 text-sm font-semibold text-[#064e3b] font-manrope outline-none shadow-[0_0_15px_rgba(6,78,59,0.1)] transition-all ${contentClassName}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClose();
              handleUpdateIssue(field, updatedValue);
            }
            if (e.key === "Escape") {
              setUpdatedValue(value);
              handleClose();
            }
          }}
        />
      ) : (
        <div className="group relative flex w-full flex-row items-center justify-start gap-1">
          <span
            className={`inline-block cursor-pointer text-sm font-semibold transition-colors ${value ? "text-[#064e3b]" : "text-[#064e3b]/40"} hover:text-[#064e3b] ${contentClassName}`}
            onClick={() => handleShow()}
          >
            {value ? value : "None"}
          </span>
          {field == "summary" && (
            <Tooltip title="Edit summary">
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#064e3b]/5 text-[#064e3b]/30 hover:text-[#064e3b]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShow();
                }}
              >
                <Edit size={14} className="font-bold" />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {show && (
        <div className="absolute top-full right-0 z-100 flex translate-y-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              handleClose();
              handleUpdateIssue(field, updatedValue);
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-[#064e3b] text-white shadow-lg hover:bg-[#059669] transition-all active:scale-90"
          >
            <Check size={18} />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setUpdatedValue(value);
              handleClose();
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white text-[#064e3b] border border-[#064e3b]/10 shadow-md hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
