import ColumnDropdown from "./columnDropdown";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { IssueType } from "@libs/types/issue";
import TypeBadge, { typeOptions } from "../badge/typeBadge";
import { memo } from "react";

const TypeDropdown = ({
  projectId,
  issueId,
  type,
}: {
  projectId: string;
  issueId: string;
  type: IssueType;
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
          label: <TypeBadge type={option.name as IssueType} className="p-2" />,
          onClick: () => {
            handleChangeType(option.name as IssueType);
          },
        };
      })}
      currentItem={undefined}
      children={<TypeBadge type={currentType?.name as IssueType} />}
    />
  );
};

export default memo(TypeDropdown);
