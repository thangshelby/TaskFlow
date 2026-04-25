import React, { lazy, Suspense, useEffect } from "react";
import { Table, Skeleton } from "antd";
import { IIssue } from "@libs/types/issue";
import { PaginationRes } from "@libs/apis/api";
import { PermissionContext } from "@libs/app/context/permission.context";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { usePermission } from "@libs/hooks/common/usePermission";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import { issues as issuesApi } from "@libs/apis/issue";
import { useQueryClient } from "@tanstack/react-query";
import { TableRowSelection } from "antd/es/table/interface";
import { useTableColumns } from "./listTable/tableColumns";
import TableFooter from "./listTable/tableFooter";
import { useIssueStore } from "@libs/store/useIssueStore";

const CreateIssueModal = lazy(
  () => import("@libs/app/components/projects/modals/issue/createIssueModal"),
);
const IssueDetailModal = lazy(
  () => import("@libs/app/components/projects/modals/issue/issueDetailModal"),
);

interface ListTableProps {
  isFetching: boolean;
  issues: IIssue[];
  pagination?: PaginationRes;
  projectId: string;
  maxHeightListTable: number;
}

const ListTable = ({
  isFetching,
  issues,
  projectId,
  pagination,
  maxHeightListTable,
}: ListTableProps) => {
  const { user } = useAuthStore();
  const { userTeams } = useUserTeams(projectId, user?.id || "");
  const [dataSource, setDataSource] = React.useState<IIssue[]>(issues);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const { openIssueDetail } = useIssueStore();
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<IIssue> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  useEffect(() => {
    setDataSource(() => {
      return issues.map((issue: IIssue) => {
        if (issue.type === "Epic") {
          return {
            ...issue,
            children: issue.children || [],
          };
        }

        return {
          ...issue,
        };
      });
    });
  }, [issues]);

  const tableColumns = useTableColumns(issues, projectId, (id) =>
    openIssueDetail(id),
  );

  const handleGetEpicIssueChildren = async (issue: IIssue) => {
    const response = await issuesApi.list({
      project_id: projectId,
      parent_ids: [issue.id],
      is_fetch: true,
    });
    response.data.data.forEach((issue) => {
      queryClient.setQueryData(["issue", projectId, issue.id], issue);
    });
    setDataSource((prev) => {
      return prev.map((item) => {
        if (item.id === issue.id) {
          return {
            ...item,
            children: Array.isArray(response.data.data)
              ? response.data.data
              : [],
          };
        }
        return item;
      });
    });
    return response.data;
  };
  type DataTypeWithKey = IIssue & { key: React.Key };

  return (
    <div>
      <Suspense fallback={null}>
        {isCreateOpen && (
          <CreateIssueModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            projectId={projectId}
          />
        )}
        <IssueDetailModal />
      </Suspense>
      {isFetching || !user || !userTeams ? (
        //  TABLE SKELETON
        <Table
          loading={isFetching}
          rowKey="key"
          pagination={false}
          bordered={true}
          scroll={{ y: maxHeightListTable || 700, x: 1000 }}
          dataSource={
            [...Array(8)].map((_, index) => ({
              key: `key${index}`,
            })) as DataTypeWithKey[]
          }
          rowSelection={{ ...rowSelection }}
          columns={tableColumns.map((column) => ({
            ...column,
            render: function renderPlaceholder() {
              return (
                <div className="flex items-center justify-center p-2">
                  <Skeleton active={true} title paragraph={false} />
                </div>
              );
            },
          }))}
        />
      ) : (
        //  TABLE
        <Table
          loading={isFetching}
          columns={tableColumns}
          dataSource={dataSource}
          bordered={true}
          className="premium-table"
          scroll={{ y: maxHeightListTable || 1000, x: 1000 }}
          rowSelection={{ 
            ...rowSelection,
          }}
          rowKey="id"
          expandable={{
            childrenColumnName: "children",
            expandedRowKeys: expandedRowKeys,
            onExpand: (isExpanded, record) => {
              if (isExpanded) {
                handleGetEpicIssueChildren(record);
                setExpandedRowKeys((prev) => [...prev, record.id]);
              } else {
                setExpandedRowKeys((prev) =>
                  prev.filter((key) => key !== record.id),
                );
              }
            },
            fixed: "right",
          }}
          footer={() => (
            <TableFooter
              selectedRowKeys={selectedRowKeys}
              onCreateClick={() => setIsCreateOpen(true)}
              visibleCount={dataSource?.length || 0}
              totalCount={pagination?.total_items || 0}
            />
          )}
          pagination={false}
          components={{
            body: {
              row: (props: any) => {
                const issue = issues.find(
                  (i) => i.id === props["data-row-key"],
                );
                const permissionResult = usePermission({
                  user: user,
                  action: PERMISSIONS_CONFIG.issue.update,
                  resource: {
                    issue: {
                      issue: issue!,
                      teams: userTeams!,
                    },
                  },
                });
                const { children, ...rest } = props;
                return (
                  <PermissionContext.Provider value={permissionResult}>
                    <tr
                      {...rest}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={`transition-colors duration-200 ${
                        permissionResult.isAllow 
                          ? "cursor-pointer hover:bg-[#f0fdf4]" 
                          : "cursor-not-allowed"
                      }`}
                    >
                      {children}
                    </tr>
                  </PermissionContext.Provider>
                );
              },
            },
          }}
        />

      )}
    </div>
  );
};

export default ListTable;
