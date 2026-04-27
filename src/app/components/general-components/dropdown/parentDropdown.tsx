import { memo, useEffect, useState, useMemo } from "react";
import { useProjectIssues } from "@libs/hooks/apis/useIssue";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import ColumnDropdown from "./columnDropdown";
import { IIssue } from "@libs/types/issue";
import { useIssue } from "@libs/hooks/apis/useIssue";
import { useParams } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
interface ParentDropdownProps {
  projectId: string;
  issue: IIssue;
  currentParentId?: string;
  isShowIcon?: boolean;
  isShowNoParent?: boolean;
}

import {
  UISize,
  UI_COMMON_SIZES,
  getBadgeSizeClass,
} from "../constants/uiConfig";

const ParentDropdown = ({
  projectId,
  issue,
  currentParentId,
  isShowIcon,
  isShowNoParent = true,
  size = "small",
}: ParentDropdownProps & { size?: UISize }) => {
  const { issues: epicIssues } = useProjectIssues({
    project_id: projectId,
    types: ["Epic"],
    is_fetch: true,
  });
  const { updateIssueAsync } = useUpdateIssue({ projectId });
  const handleChangeIssueParent = (updatedParentId: string) => {
    updateIssueAsync({
      id: issue.id,
      data: {
        parent_id: updatedParentId,
      },
    });
  };
  const currentParent = useMemo(() => {
    return epicIssues.find((iss: IIssue) => iss.id === currentParentId);
  }, [epicIssues, currentParentId]);

  return (
    <ColumnDropdown
      items={epicIssues
        .map((issue: IIssue) => {
          return {
            value: issue.summary,
            key: issue.id,
            label: <ParentBadge title={issue.summary} isShowIcon={true} size={size} />,
            onClick: () => {
              handleChangeIssueParent(issue.id);
            },
          };
        })
        .concat({
          value: "No Parent",
          key: "NULL",
          label: (
            <div
              className={`flex items-center gap-1 border-l-2 border-transparent p-2 hover:border-[#064e3b] hover:bg-[#f0fdf4] transition-all duration-200`}
            >
              <p className="truncate text-xs font-bold text-[#404944] tracking-tight">No Parent</p>
            </div>
          ),
          onClick: () => {
            handleChangeIssueParent("NULL");
          },
        })}
      currentItem={currentParent?.summary}
    >
      <ParentBadge
        issueId={issue?.parent_id || currentParentId}
        title={currentParent?.summary}
        isShowIcon={isShowIcon}
        isShowNoParent={isShowNoParent}
        size={size}
      />
    </ColumnDropdown>
  );
};

export const ParentBadge = ({
  title,
  issueId,
  isShowIcon,
  isShowNoParent,
  size = "small",
}: {
  title?: string;
  issueId?: string;
  isShowIcon?: boolean;
  isShowNoParent?: boolean;
  size?: UISize;
}) => {
  const { projectId } = useParams();
  const { issue } = useIssue(projectId || "", issueId!);
  const [titleRender, setTitleRender] = useState(title);

  useEffect(() => {
    if (!title) {
      setTitleRender(issue?.summary);
    }
  }, [issue]);

  if (!titleRender) {
    if (isShowNoParent) {
      return (
        <div className="flex items-center gap-1">
          {isShowIcon && (
            <AiOutlineThunderbolt
              size={UI_COMMON_SIZES[size].iconSize}
              className="text-purple-700"
            />
          )}
          <div
            className={`flex items-center justify-center border border-gray-100 bg-[#f9f9f8] shadow-sm ${getBadgeSizeClass(size)}`}
          >
            <p className="truncate font-bold text-[#404944]/50 uppercase tracking-widest text-[9px]">
              No Parent
            </p>
          </div>
        </div>
      );
    }
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      {isShowIcon && (
        <AiOutlineThunderbolt
          size={UI_COMMON_SIZES[size].iconSize}
          className="text-purple-700"
        />
      )}
      <div
        className={`flex items-center justify-center border border-purple-200 bg-purple-50 shadow-sm ${getBadgeSizeClass(size)}`}
      >
        <p className="truncate font-bold text-purple-700 uppercase tracking-widest min-w-0 text-[10px]">
          {titleRender}
        </p>
      </div>
    </div>
  );
};

export default memo(ParentDropdown);
