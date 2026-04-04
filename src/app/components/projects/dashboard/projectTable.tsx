import React, { useState } from "react";
import { Button, Dropdown, Menu, Table } from "antd";
import type { TableColumnsType } from "antd";
import { useDeleteProject, useUserProjects } from "@libs/hooks/apis/useProject";
import { useNavigate } from "react-router-dom";
import { IProject } from "@libs/types/project";
import { LuEllipsisVertical } from "react-icons/lu";
import ConfirmDeleteModal from "@libs/app/components/general-components/modal/modalDeleteConfirm";
import CreateProjectModal from "@libs/app/components/projects/modals/project/createProjectModal";
import ModalPortal from "@libs/app/components/general-components/modal/modalPortal";

const columns: TableColumnsType<IProject> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "40%",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Key",
    dataIndex: "key",
    width: "20%",
    sorter: (a, b) => a.key.length - b.key.length,
  },
  {
    title: "Access Type",
    dataIndex: "access",
    width: "20%",
    sorter: (a, b) => a.access.length - b.access.length,
  },
  {
    title: "Type",
    dataIndex: "type",
    width: "10%",
    sorter: (a, b) => a.type.length - b.type.length,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    width: "10%",
    align: "center",
    render: (_, record) => <ProjectActions record={record} />,
  },
];

const ProjectTable: React.FC = () => {
  const { projects, isLoading } = useUserProjects();
  const navigate = useNavigate();

  return (
    <Table<IProject>
      columns={columns}
      dataSource={projects}
      loading={isLoading}
      onRow={(record) => {
        return {
          style: { cursor: "pointer" },
          onClick: (e) => {
            e.stopPropagation();
            navigate(`/projects/${record.id}/summary`);
          },
        };
      }}
    />
  );
};
export default ProjectTable;

const ProjectActions = ({ record }: { record: IProject }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { deleteProject, isLoading } = useDeleteProject({
    onClose: () => setIsDeleteModalOpen(false),
  });
  const menuItems = [
    {
      key: "edit",
      label: "Edit",
      onClick: () => {
        setIsEditModalOpen(true);
      },
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];
  const handleDelete = async () => {
    deleteProject(record.id);
  };
  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottom"
        popupRender={() => (
          <div className="w-[140px]">
            <Menu
              items={menuItems}
              onClick={({ domEvent }) => {
                domEvent.stopPropagation();
              }}
            />
          </div>
        )}
      >
        <Button
          type="text"
          icon={<LuEllipsisVertical />}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
      <ModalPortal>
        <div
          onClick={(e) => e.stopPropagation()} // Prevent propagation when clicking on the modal background
        >
          <ConfirmDeleteModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            loading={isLoading}
            title="Delete Project"
            description={`Are you sure you want to delete "${record.name}"?`}
          />
          <CreateProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
            }}
            iniProject={record}
            isEditing={true}
          />
        </div>
      </ModalPortal>
    </>
  );
};
