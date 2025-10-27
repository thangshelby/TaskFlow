import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import "./createIssueModal.css";
import {
  useProject,
  useProjectColumns,
  useUserProjects,
} from "@libs/hooks/apis/useProject";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import {
  useCreateIssue,
  useUpdateIssue,
  useProjectIssues,
} from "@libs/hooks/apis/useIssue";
import { useProjectSprints } from "@libs/hooks/apis/useSprint";
import { useProjectTeams } from "@libs/hooks/apis/useTeam";
import { IssuePriority, CreateIssueParams } from "@libs/types/issue";
import { useAuthStore } from "@libs/store/useAuthStore";
import { IssueType } from "@libs/types/issue";
import InputField from "@libs/app/components/general-components/inputField";
import PriorityBadge from "@libs/app/components/general-components/badge/priorityBadge";
import TypeBadge from "@libs/app/components/general-components/badge/typeBadge";
import StatusBadge from "@libs/app/components/general-components/badge/statusBadge";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  sprintId?: string;
  isEditing?: boolean;
  initialIssue?: {
    id: string;
    summary?: string;
    description?: string;
    column_id: string;
    priority: string;
    type: IssueType;
    sprint_id?: string;
    assignee_id?: string;
  };
}

interface IssueFormInputs {
  summary: string;
  description?: string;
  priority: IssuePriority;
  type: IssueType;
  column_id: string;
  sprint_id?: string;
  assignee_id?: string;
  attachments: File[];
  project_id: string;
  parent_id?: string;
  due_date_to?: string;
  start_date?: string;
  story_point?: number;
  team_id?: string;
}

const issueSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  column_id: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Lowest", "Highest"] as const),
  type: z.enum(["Bug", "Task", "Story", "Epic"] as const),
  sprint_id: z.string().optional(),
  assignee_id: z.string().optional(),
  attachments: z.array(z.instanceof(File)).min(0),
  project_id: z.string().min(1, "Project is required"),
  parent_id: z.string().optional(),
  due_date_to: z.string().optional(),
  start_date: z.string().optional(),
  story_point: z.number().min(0).optional(),
  team_id: z.string().optional(),
});

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  projectId,
  sprintId,
  isEditing,
  initialIssue,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projectId || "",
  );
  const { user } = useAuthStore();
  const { projects } = useUserProjects();
  const { project } = useProject(projectId || "");
  const { columns } = useProjectColumns({ project_id: selectedProjectId });
  const { sprints } = useProjectSprints(selectedProjectId);
  const { teams } = useProjectTeams(selectedProjectId);
  const { issues } = useProjectIssues({
    project_id: selectedProjectId,
    is_fetch: !!selectedProjectId,
  });
  const { projectMembers } = useProjectMembers({
    project_id: selectedProjectId,
  });

  const { createIssue, isLoading: isCreating } = useCreateIssue({
    projectId: selectedProjectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const { updateIssue, isLoading: isUpdating } = useUpdateIssue({
    projectId: selectedProjectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const isLoading = isCreating || isUpdating;
  const { isLoading: isColumnsLoading } = useProjectColumns({
    project_id: selectedProjectId,
  });

  const defaultValues: IssueFormInputs = {
    summary: "",
    description: "",
    column_id: "",
    priority: "Medium",
    type: "Task",
    project_id: projectId || "",
    sprint_id: sprintId || "",
    attachments: [],
    parent_id: "",
    due_date_to: "",
    start_date: "",
    story_point: 0,
    team_id: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormInputs>({
    resolver: zodResolver(issueSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isEditing && initialIssue) {
      reset({
        ...defaultValues,
        summary: initialIssue.summary || "",
        description: initialIssue.description || "",
        column_id: initialIssue.column_id,
        priority: initialIssue.priority as IssuePriority,
        type: initialIssue.type,
        sprint_id: initialIssue.sprint_id,
        assignee_id: initialIssue.assignee_id,
        parent_id: "",
        due_date_to: "",
        start_date: "",
        story_point: 0,
        team_id: "",
      });
    }
  }, [isEditing, initialIssue, reset]);

  const column_id = watch("column_id");
  const files = watch("attachments");

  React.useEffect(() => {
    if (columns?.length > 0 && !column_id) {
      setValue("column_id", columns[0].id);
    }
  }, [columns, setValue, column_id]);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setValue("attachments", droppedFiles);
    },
    [setValue],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      setValue("attachments", selectedFiles);
    },
    [setValue],
  );

  const onSubmit = handleSubmit(async (data: IssueFormInputs) => {
    if (!user?.id) {
      console.error("No user found");
      return;
    }

    // Convert File objects to string paths (in real app, you'd upload files first)
    const attachmentPaths = data.attachments.map((file: File) =>
      URL.createObjectURL(file),
    );

    if (!selectedProjectId) {
      console.error("No project selected");
      return;
    }

    const issueData: CreateIssueParams = {
      project_id: selectedProjectId,
      summary: data.summary,
      description: data.description,
      column_id: data.column_id,
      priority: data.priority,
      type: data.type as IssueType,
      sprint_id: data.sprint_id || "",
      reporter_id: user.id,
      assignee_id: data.assignee_id,
      attachments: attachmentPaths,
      parent_id: data.parent_id,
      due_date_to: data.due_date_to,
      story_point: data.story_point,
      team_id: data.team_id,
    };

    if (isEditing && initialIssue) {
      try {
        await updateIssue({ id: initialIssue.id, data: issueData });
        toast.success("Issue updated successfully!");
      } catch (error) {
        toast.error(
          `Failed to update issue: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    } else {
      createIssue(issueData);
    }
  });

  if (!isOpen) return null;
  return (
    <Modal
      title={isEditing ? "Update Issue" : "Create Issue"}
      onClose={onClose}
      buttonContent={
        isLoading || isColumnsLoading
          ? "Loading..."
          : isEditing
            ? "Update Issue"
            : "Create Issue"
      }
      onSubmit={onSubmit}
      className={"w-[600px]"}
      isLoadingButton={isLoading || isColumnsLoading}
      isSubmitDisabled={isColumnsLoading || !columns?.length}
    >
      <div className="p-4">
        <form className="flex flex-col gap-8">
          <div className="flex w-full flex-col gap-8">
            {/* Project Selection/Display */}
            {projectId ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project
                </label>
                <div className="rounded-md bg-gray-50 px-3 py-2">
                  <span className="text-gray-900">
                    {projects?.find((p) => p.id === watch("project_id"))?.name}
                  </span>
                </div>
              </div>
            ) : (
              //Project dropdown
              <div className="w-full">
                {projects?.length > 0 ? (
                  <DropdownAntd
                    options={
                      projects?.map((project) => ({
                        value: project.id,
                        label: project.name,
                      })) || []
                    }
                    placement="bottom"
                    rowClassName="font-semibold text-gray-700"
                    menuClassName="min-w-[180px]"
                    parent={
                      <InputField
                        label="Project"
                        helperText="Project of the issue"
                        field="project_id"
                        isShowIcon={true}
                        type="select"
                        error={errors.project_id?.message}
                        customRender={
                          <div className="w-full">
                            {
                              projects?.find(
                                (p) => p.id === watch("project_id"),
                              )?.name
                            }
                          </div>
                        }
                      />
                    }
                    isShowIcon={false}
                    onClickItem={(option: { value: string; label: string }) => {
                      setSelectedProjectId(option.value);
                      setValue("project_id", option.value as string);
                    }}
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">
                      No projects available. Please create a project first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Sprint Selection/Display */}
            {selectedProjectId && (
              <div className="w-full">
                {sprintId ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Sprint
                    </label>
                    <div className="rounded-md bg-gray-50 px-3 py-2">
                      <span className="text-gray-900">
                        {
                          sprints?.find((s) => s.id === watch("sprint_id"))
                            ?.name
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <DropdownAntd
                    options={
                      sprints?.map((sprint) => ({
                        value: sprint.id,
                        label: sprint.name,
                      })) || []
                    }
                    placement="bottom"
                    rowClassName="font-semibold text-gray-700"
                    menuClassName="w-[450px]"
                    parent={
                      <InputField
                        label="Sprint"
                        helperText="Sprint of the issue"
                        field="sprint_id"
                        isShowIcon={true}
                        type="select"
                        error={errors.sprint_id?.message}
                        customRender={
                          <div className="w-full">
                            {
                              sprints?.find((s) => s.id === watch("sprint_id"))
                                ?.name
                            }
                          </div>
                        }
                      />
                    }
                    isShowIcon={false}
                    onClickItem={(option) =>
                      setValue("sprint_id", option.value as string)
                    }
                  />
                )}
              </div>
            )}
          </div>

          <DropdownAntd
            options={["Bug", "Task", "Story", "Epic"].map((value) => ({
              value,
              label: value,
              customRender: (
                <TypeBadge className="p-0!" type={value as IssueType} />
              ),
            }))}
            placement="bottom"
            rowClassName="w-full text-[15px] border-none"
            menuClassName="w-[180px]"
            parent={
              <InputField
                label="Type"
                helperText="Type of the issue"
                field="type"
                type="select"
                error={errors.type?.message}
                isShowIcon={true}
                customRender={
                  <TypeBadge
                    className="p-0!"
                    type={watch("type") as IssueType}
                  />
                }
              />
            }
            isShowIcon={false}
            onClickItem={(option) =>
              setValue("type", option.value as IssueType)
            }
          />

          <DropdownAntd
            options={[
              { value: "Highest", label: "Highest" },
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
              { value: "Lowest", label: "Lowest" },
            ].map((option) => ({
              ...option,
              customRender: (
                <PriorityBadge
                  className="p-0! hover:bg-transparent!"
                  priority={option.value as IssuePriority}
                  isShowLabel={true}
                />
              ),
            }))}
            placement="bottom"
            rowClassName="w-full text-[15px]"
            menuClassName="w-[180px]"
            parent={
              <InputField
                label="Priority"
                helperText="Priority of the issue"
                field="priority"
                isShowIcon={true}
                type="select"
                error={errors.priority?.message}
                customRender={
                  <PriorityBadge
                    className="p-0! hover:bg-transparent!"
                    priority={watch("priority") as IssuePriority}
                    isShowLabel={true}
                  />
                }
              />
            }
            isShowIcon={false}
            onClickItem={(option) =>
              setValue("priority", option.value as IssuePriority)
            }
          />

          <InputField
            label="Summary"
            helperText="Brief summary of the issue"
            field="summary"
            type="text"
            register={register}
            error={errors.summary?.message}
          />

          <InputField
            label="Description"
            helperText="Detailed description of the issue"
            type="textarea"
            field="description"
            register={register}
            error={errors.description?.message}
          />

          {/* Parent Field */}
          <DropdownAntd
            options={
              issues?.map((issue) => ({
                value: issue.id,
                label: `${issue.key} - ${issue.summary}`,
              })) || []
            }
            placement="bottom"
            rowClassName="font-semibold text-gray-700"
            menuClassName="min-w-[300px]"
            parent={
              <InputField
                label="Parent"
                helperText="Your work type hierarchy determines the work items you can select here."
                field="parent_id"
                isShowIcon={true}
                type="select"
                error={errors.parent_id?.message}
              />
            }
            isShowIcon={false}
            onClickItem={(option: { value: string; label: string }) => {
              setValue("parent_id", option.value as string);
            }}
          />

          {/* Due Date Field */}
          <InputField
            label="Due date"
            helperText="Deadline for completing this issue"
            field="due_date_to"
            type="date"
            error={errors.due_date_to?.message}
          />

          {/* Team Field */}
          <DropdownAntd
            options={
              teams?.map((team) => ({
                value: team.id,
                label: team.name,
              })) || []
            }
            placement="bottom"
            rowClassName="font-semibold text-gray-700"
            menuClassName="min-w-[200px]"
            parent={
              <InputField
                label="Team"
                helperText="Associates a team to an issue. You can use this field to search and filter issues by team."
                field="team_id"
                isShowIcon={true}
                type="select"
                error={errors.team_id?.message}
              />
            }
            isShowIcon={false}
            onClickItem={(option: { value: string; label: string }) => {
              setValue("team_id", option.value as string);
            }}
          />

          {/* Start Date Field */}
          <InputField
            label="Start date"
            helperText="Allows the planned start date for a piece of work to be set."
            field="start_date"
            type="date"
            error={errors.start_date?.message}
          />

          {/* Story Point Estimate Field */}
          <InputField
            label="Story point estimate"
            helperText="Estimated effort required for this issue"
            field="story_point"
            type="number"
            error={errors.story_point?.message}
          />

          <DropdownAntd
            options={
              columns?.map((column) => ({
                value: column.id,
                label: column.name,
                customRender: (
                  <StatusBadge
                    className="border-none! bg-transparent! p-0!"
                    columnId={column.id}
                    projectId={selectedProjectId}
                  />
                ),
              })) || []
            }
            isShowIcon={false}
            placement="bottom"
            rowClassName="w-full text-[15px]"
            menuClassName="w-[180px]"
            parent={
              <InputField
                label="Status"
                helperText="Status of the issue"
                field="column_id"
                isShowIcon={true}
                type="select"
                error={errors.column_id?.message}
                customRender={
                  <StatusBadge
                    className="border-none! bg-transparent! p-0!"
                    columnId={watch("column_id") as string}
                    projectId={selectedProjectId}
                  />
                }
              />
            }
            onClickItem={(option) => setValue("column_id", option.value)}
          />
          {errors.column_id && (
            <p className="mt-1 text-sm text-red-500">
              {errors.column_id.message}
            </p>
          )}

          <DropdownAntd
            options={
              projectMembers?.map((member) => ({
                value: member.user_id,
                label: member.user_id || "", // Use a string for label
                customRender: (
                  <UserAvatar
                    userId={member.user_id}
                    isDisplayName={true}
                    size={20}
                  />
                ),
              })) || []
            }
            isShowIcon={false}
            placement="bottom"
            rowClassName="w-full text-[16px]"
            menuClassName="min-w-[200px]"
            parent={
              <InputField
                label="Assignee"
                helperText="Assignee of the issue"
                field="assignee_id"
                isShowIcon={true}
                type="select"
                error={errors.assignee_id?.message}
                customRender={
                  <UserAvatar
                    userId={watch("assignee_id") as string}
                    isDisplayName={true}
                    size={24}
                  />
                }
              />
            }
            onClickItem={(option) => setValue("assignee_id", option.value)}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div
              className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${files.length ? "border-green-500 bg-green-50" : "hover:border-green-500 hover:bg-green-50"}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <p>
                {files.length
                  ? "Drop files here or click to replace"
                  : "Drag & drop files here, or click to select files"}
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <ul className="list-disc pl-5">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateIssueModal;
