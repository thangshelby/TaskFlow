import ColumnDropdown from "./columnDropdown";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { IssueType } from "@libs/types/issue";
import TypeBadge, { typeOptions } from "../badge/typeBadge";
import { memo } from "react";

const TypeDropdown = ({
  projectId,
  issueId,
  type,
  size = "small"
}: {
  projectId: string;
  issueId: string;
  type: IssueType;
  size?: "small" | "medium" | "large";
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangeType = (updatedType: IssueType) => {
    updateIssueAsync({
      id: issueId,
      data: {
        type: updatedType,
      },
    });
  };

  const currentType = typeOptions.find((option) => option.name === type);

  return (
    <ColumnDropdown
      disabled={true}
      items={typeOptions.map((option) => {
        return {
          value: option.name,
          key: option.id,
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: (
            <div className="border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200">
              <TypeBadge type={option.name as IssueType} size={size} />
            </div>
          ),
          onClick: () => {
            handleChangeType(option.name as IssueType);
          },
        };
      })}
      currentItem={undefined}
      children={<TypeBadge type={currentType?.name as IssueType} size={size} />}
    />
  );
};

export default memo(TypeDropdown);
