import ColumnDropdown from "./columnDropdown";
import { IssuePriority } from "@libs/types/issue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import PriorityBadge, { priorityOptions } from "../badge/priorityBadge";
import { memo } from "react";

const PriorityDropdown = ({
  projectId,
  issueId,
  priority,
  isShowLabel,
  size = "small",
}: {
  projectId: string;
  issueId: string;
  priority: IssuePriority;
  isShowLabel?: boolean;
  size?: "small" | "medium" | "large";
}) => {
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleChangePriority = (updatedPriority: IssuePriority) => {
    updateIssueAsync({
      id: issueId,
      data: {
        priority: updatedPriority,
      },
    });
  };

  const currentPriority = priorityOptions.find(
    (option) => option.name === priority,
  );

  return (
    <ColumnDropdown
      items={priorityOptions.map((option) => {
        return {
          value: option.name,
          key: option.name,
          style: {
            padding: 0,
            background: "white",
            border: "none",
            boxShadow: "none",
          },
          label: (
            <div className="border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200">
              <PriorityBadge
                priority={option.name as IssuePriority}
                isShowLabel={true}
                size={size}
                className="hover:bg-transparent!"
              />
            </div>
          ),
          onClick: () => {
            handleChangePriority(option.name as IssuePriority);
          },
        };
      })}
      currentItem={undefined}
      children={
        <PriorityBadge
          priority={currentPriority?.name as IssuePriority}
          isShowLabel={isShowLabel}
          size={size}
        />
      }
    />
  );
};

export default memo(PriorityDropdown);
