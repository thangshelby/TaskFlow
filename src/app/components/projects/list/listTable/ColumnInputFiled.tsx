import { IIssue } from "@libs/types/issue";
import { useState, useEffect } from "react";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { useIssue } from "@libs/hooks/apis/useIssue";

const ColumnInputFiled = ({
  issueId,
  projectId,
  field,
  inputType = "text",
}: {
  issueId: string;
  projectId: string;
  field: keyof IIssue;
  inputType?: "text" | "number";
}) => {
  const { issue } = useIssue(projectId, issueId);
  const [newValue, setNewValue] = useState(
    issue?.[field] || (inputType === "number" ? 0 : ""),
  );
  const { updateIssueAsync } = useUpdateIssue({
    projectId,
  });
  useEffect(() => {
    setNewValue(issue?.[field] || (inputType === "number" ? 0 : ""));
  }, [issue, field, inputType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };
  if (!issue) return <></>;
  return (
    <input
      onChange={handleChange}
      type={inputType}
      onBlur={(e) => {
        if (e.target.value !== issue?.[field]) {
          updateIssueAsync({
            id: issue.id,
            data: { [field]: e.target.value },
          });
        }
      }}
      value={newValue?.toString()}
      className={`transition-all duration-200 hover:bg-[#f9f9f8] flex items-center gap-2 rounded border-2 border-transparent px-2 py-1 outline-none focus:border-[#064e3b] ${inputType === "number" ? "text-right" : ""} w-full`}

    />
  );
};

export default ColumnInputFiled;
