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
    <div className={`relative w-full ${containerClassName}`}>
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
          className={`w-full rounded-md border-2 border-green-500 p-1 outline-none ${contentClassName}`}
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
            className={`inline-block cursor-pointer text-sm ${value ? "rounded-sm bg-gray-200 px-2 py-0.5 font-thin text-gray-900" : "font-semibold text-gray-500"} ${contentClassName}`}
            onClick={() => handleShow()}
          >
            {value ? value : "None"}
          </span>
          {field == "summary" && (
            <Tooltip title="Edit summary">
              <button
                className="opacity-0 group-hover:opacity-100"
                onClick={() => {
                  handleShow();
                }}
              >
                <Edit size={16} className="font-bold text-gray-700" />
              </button>
            </Tooltip>
          )}
        </div>
      )}

      {show && (
        <div className="absolute top-full right-0 z-50 flex translate-y-1 gap-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            style={{
              boxShadow: "4px 8px 16px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              handleClose();
              handleUpdateIssue(field, updatedValue);
            }}
            className="z-50 flex cursor-pointer items-center justify-center rounded-md bg-white p-2 shadow-2xl hover:bg-gray-200"
          >
            <Check size={18} className="text-gray-900" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            style={{
              boxShadow: "-4px 8px 16px rgba(0,0,0,0.2)",
            }}
            onClick={() => {
              setUpdatedValue(value);
              handleClose();
            }}
            className="z-50 flex cursor-pointer items-center justify-center rounded-md bg-white p-2 shadow-md hover:bg-gray-200"
          >
            <X size={18} className="text-gray-900" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
