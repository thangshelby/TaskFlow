import { UseFormRegister, RegisterOptions, FieldValues } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa6";
import { Calendar } from "lucide-react";

const InputField = ({
  label,
  field,
  helperText,
  type = "text",
  error,
  register,
  registerOptions,
  isShowIcon = false,
  customRender,
}: {
  label: string;
  field: string;
  helperText: string;
  type?: "text" | "textarea" | "file" | "date" | "number" | "select";
  error?: string;
  register?: UseFormRegister<any>;
  registerOptions?: RegisterOptions<FieldValues, string>;
  isShowIcon?: boolean;
  customRender?: React.ReactNode;
}) => {
  const sharedClasses = `effect-20 b h-full w-full  px-2 py-2 text-md font-medium placeholder:text-sm placeholder:font-semibold focus:border-none`;
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="input-effect group relative col-3 flex w-full items-center justify-between rounded-xs border border-gray-300 pr-2">
        {type === "textarea" && (
          <textarea
            {...(register ? register(field, registerOptions) : {})}
            className={`${sharedClasses} ${error ? "error" : ""}`}
            placeholder={helperText}
            rows={4}
          />
        )}

        {type === "text" && (
          <input
            {...(register ? register(field, registerOptions) : {})}
            className={`${sharedClasses} ${error ? "error" : ""}`}
            placeholder={helperText}
            type={type}
          />
        )}

        {type === "select" && (
          <input
            className={`${sharedClasses} ${error ? "error" : ""}`}
            type={type}
            style={{
              maxWidth: "1px",
            }}
            disabled={true}
          />
        )}

        {(type === "date" || type === "number") && (
          <input
            {...(register ? register(field, registerOptions) : {})}
            className={`${sharedClasses} ${error ? "error" : ""}`}
            placeholder={helperText}
            type={type}
          />
        )}
        <div className="absolute top-2 left-2">
          {customRender && customRender}
        </div>

        <label className="text-lg font-medium">{label}</label>
        {isShowIcon && <FaChevronDown className="text-gray-500 absolute top-2 right-2" />}
        {type === "date" && !isShowIcon && (
          <Calendar className="text-gray-400" size={16} />
        )}

        <span className="focus-border">
          <i></i>
        </span>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
