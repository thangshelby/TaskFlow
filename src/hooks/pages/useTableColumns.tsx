import React, { useMemo, Suspense } from "react";
import { TableColumnType, Skeleton } from "antd";
import { IIssue, IssuePriority, IssueType } from "@libs/types/issue";
import TableColumn from "@libs/app/components/projects/list/listTable/tableColumn";

// Lazy imports
const ColumnInputFiled = React.lazy(() => import("@libs/app/components/projects/list/listTable/ColumnInputFiled"));
const TypeDropdown = React.lazy(() =>
    import("@libs/app/components/general-components/dropdown/typeDropdown").then((m) => m),
);
const StatusDropdown = React.lazy(() =>
    import("@libs/app/components/general-components/dropdown/statusDropdown").then((m) => m),
);
const PriorityDropdown = React.lazy(() =>
    import("@libs/app/components/general-components/dropdown/priorityDropdown").then(
        (m) => m,
    ),
);
const SprintDropdown = React.lazy(() =>
    import("@libs/app/components/general-components/dropdown/sprintDropdown").then((m) => m),
);
const UserDropdown = React.lazy(
    () => import("@libs/app/components/general-components/dropdown/userDropdown"),
);
const CustomDatePicker = React.lazy(
    () => import("@libs/app/components/general-components/customDatePicker"),
);
const TeamDropdown = React.lazy(
    () => import("@libs/app/components/general-components/dropdown/teamDropdown"),
);
const ParentDropdown = React.lazy(
    () => import("@libs/app/components/general-components/dropdown/parentDropdown"),
);

const FallBack = () => {
    return (
        <div className="flex items-center justify-center p-2">
            <Skeleton active={true} title paragraph={false} />
        </div>
    );
};

export const useTableColumns = (
    issues: IIssue[],
    projectId: string,
    onIssueClick?: (issueId: string) => void,
) => {
    const tableColumns: TableColumnType<IIssue>[] = useMemo(
        () => [
            // Type
            TableColumn(
                "type",
                "Type",
                (_, { id, type }) => (
                    <Suspense fallback={<FallBack />}>
                        <div className="px-4">
                            <TypeDropdown
                                projectId={projectId}
                                issueId={id}
                                type={type as IssueType}
                            />
                        </div>
                    </Suspense>
                ),
                120,
            ),

            // key (không lazy)
            TableColumn(
                "key",
                "Key",
                (_, { id, key }) => (
                    <Suspense fallback={<FallBack />}>
                        <div
                            className="cursor-pointer p-2 text-[#064e3b] hover:underline"
                            onClick={() => onIssueClick?.(id)}
                        >
                            <p className="text-xs font-bold tracking-tight">{key}</p>
                        </div>
                    </Suspense>
                ),
                100,
            ),

            // Summary
            TableColumn(
                "summary",
                "Summary",
                (_, { id }) => (
                    <Suspense fallback={<FallBack />}>
                        <ColumnInputFiled
                            issueId={id}
                            projectId={projectId}
                            field="summary"
                        />
                    </Suspense>
                ),
                250,
            ),

            // Status
            TableColumn("column.name", "Status", (_, { id, column }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4">
                        <StatusDropdown
                            projectId={projectId}
                            issueId={id}
                            column={column}
                        />
                    </div>
                </Suspense>
            )),

            // Sprint
            TableColumn("sprint_id", "Sprint", (_, { id, sprint_id }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4">
                        <SprintDropdown
                            projectId={projectId}
                            issueId={id}
                            sprintId={sprint_id || ""}
                        />
                    </div>
                </Suspense>
            )),

            // Assignee
            TableColumn("assignee_id", "Assignee", (_, { id, assignee_id }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4">
                        <UserDropdown
                            projectId={projectId}
                            issueId={id}
                            selectedUserId={assignee_id || ""}
                            columnField="assignee_id"
                        />
                    </div>
                </Suspense>
            )),

            // Reporter
            TableColumn("reporter_id", "Reporter", (_, { id, reporter_id }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4 cursor-not-allowed">
                        <UserDropdown
                            projectId={projectId}
                            issueId={id}
                            selectedUserId={reporter_id || ""}
                            columnField="reporter_id"
                            isEditable={false}
                        />
                    </div>
                </Suspense>
            )),

            // Priority
            TableColumn(
                "priority",
                "Priority",
                (_, { id, priority }) => (
                    <Suspense fallback={<FallBack />}>
                        <div className="px-4 py-1">
                            <PriorityDropdown
                                projectId={projectId}
                                issueId={id}
                                priority={priority as IssuePriority}
                                isShowLabel={true}
                            />
                        </div>
                    </Suspense>
                ),
                120,
            ),

            // Parent Issue
            TableColumn("parent_id", "Parent Issue", (_, { id, parent_id }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4">
                        <ParentDropdown
                            projectId={projectId}
                            issue={issues.find((issue) => issue.id === id)!}
                            currentParentId={parent_id}
                        />
                    </div>
                </Suspense>
            )),

            // Team
            TableColumn("team_id", "Team", (_, { id, team_id }) => (
                <Suspense fallback={<FallBack />}>
                    <div className="px-4">
                        <TeamDropdown
                            projectId={projectId}
                            issueId={id}
                            selectedTeamId={team_id || ""}
                            columnField="team_id"
                        />
                    </div>
                </Suspense>
            )),

            // Story Point
            TableColumn(
                "story_point",
                "Story Point",
                (_, { id }) => (
                    <Suspense fallback={<FallBack />}>
                        <ColumnInputFiled
                            issueId={id}
                            projectId={projectId}
                            field="story_point"
                            inputType="number"
                        />
                    </Suspense>
                ),
                120,
            ),

            // Due Date From
            TableColumn("due_date_from", "Due Date From", (_, { id }) => (
                <Suspense fallback={<FallBack />}>
                    <CustomDatePicker
                        field="due_date_from"
                        projectId={projectId}
                        className="px-2"
                        issueId={id}
                    />
                </Suspense>
            )),

            // Due Date To
            TableColumn("due_date_to", "Due Date To", (_, { id }) => (
                <Suspense fallback={<FallBack />}>
                    <CustomDatePicker
                        field="due_date_to"
                        projectId={projectId}
                        className="px-2"
                        issueId={id}
                    />
                </Suspense>
            )),

            // Created At
            TableColumn("created_at", "Created At", (_, { id }) => (
                <Suspense fallback={<FallBack />}>
                    <CustomDatePicker
                        field="created_at"
                        projectId={projectId}
                        className="px-2"
                        isEditable={false}
                        issueId={id}
                    />
                </Suspense>
            )),
        ],
        [issues, projectId],
    );

    return tableColumns;
};
