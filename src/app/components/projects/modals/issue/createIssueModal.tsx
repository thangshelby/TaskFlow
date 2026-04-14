import React, { useState, useRef } from "react";
import { uploadFileToCloudinary } from "@libs/utils/file";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import "./createIssueModal.css";
import {
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
import { MdCloudUpload } from "react-icons/md";
import AttachmentCard from "@libs/app/components/issues/metadataSection/attachmentCard";
import QuillEditorCreate from "@libs/app/components/issues/metadataSection/quillEditorCreate";

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
  priority: IssuePriority;
  type: IssueType;
  column_id: string;
  sprint_id?: string;
  assignee_id?: string;
  project_id: string;
  parent_id?: string;
  due_date_to?: string;
  start_date?: string;
  story_point?: number;
  team_id?: string;
}

const issueSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  column_id: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Lowest", "Highest"] as const),
  type: z.enum(["Bug", "Task", "Story", "Epic"] as const),
  sprint_id: z.string().optional(),
  assignee_id: z.string().optional(),
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

  // Attachments stored as JSON strings (same format as metadataSection)
  const [attachments, setAttachments] = useState<string[]>([]);
  // Description managed via Quill editor (already stringified as { plainText, delta })
  const [descriptionValue, setDescriptionValue] = useState<string>("");

  const defaultValues: IssueFormInputs = {
    summary: "",
    column_id: "",
    priority: "Medium",
    type: "Task",
    project_id: projectId || "",
    sprint_id: sprintId || "",
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

  React.useEffect(() => {
    if (columns?.length > 0 && !column_id) {
      setValue("column_id", columns[0].id);
    }
  }, [columns, setValue, column_id]);

  const onSubmit = handleSubmit(async (data: IssueFormInputs) => {
    if (!user?.id) {
      toast.error("You must be logged in to create an issue.");
      return;
    }

    if (!selectedProjectId) {
      toast.error("Please select a project first.");
      return;
    }

    const issueData: CreateIssueParams = {
      project_id: selectedProjectId,
      summary: data.summary,
      description: descriptionValue,
      column_id: data.column_id,
      priority: data.priority,
      type: data.type as IssueType,
      sprint_id: data.sprint_id || "",
      reporter_id: user.id,
      assignee_id: data.assignee_id,
      attachments,
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

  // Safe JSON parse — never throws, returns null on invalid input
  const safeParseAttachment = (raw: string) => {
    try { return JSON.parse(raw) as { url: string; type: string; uploadFrom: string; created_at: string }; }
    catch { return null; }
  };

  // Upload file to Cloudinary and store as JSON string (same as metadataSection)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFileToCloudinary(undefined, file);
      const newAttachment = JSON.stringify({
        url,
        type: file.type,
        uploadFrom: "attachment",
        created_at: new Date().toISOString(),
      });
      setAttachments((prev) => [...prev, newAttachment]);
    } catch {
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleDeleteAttachment = (url: string) => {
    setAttachments((prev) =>
      prev.filter((a) => safeParseAttachment(a)?.url !== url)
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);


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

          {/* Description — Quill editor (same format as updateIssue) */}
          <div className="flex w-full flex-col gap-1">
            <p className="text-sm font-bold text-gray-600">Description</p>
            <div className="rounded border border-gray-300 focus-within:border-emerald-500">
              <QuillEditorCreate
                onChange={setDescriptionValue}
                placeholder="Add a description..."
              />
            </div>
          </div>

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

          {/* Attachments — same flow as metadataSection */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <p className="text-sm font-bold text-gray-600">Attachments</p>
              {attachments.length > 0 && (
                <div className="rounded bg-gray-300 px-2 text-sm font-medium text-gray-600">
                  {attachments.length}
                </div>
              )}
            </div>

            {/* Drop zone */}
            <div
              className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border-2 border-dashed py-4 transition-colors ${
                attachments.length
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
              }`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFileToCloudinary(undefined, file);
                  setAttachments((prev) => [...prev, JSON.stringify({
                    url,
                    type: file.type,
                    uploadFrom: "attachment",
                    created_at: new Date().toISOString(),
                  })]);
                } catch {
                  toast.error("Failed to upload attachment. Please try again.");
                }
              }}
              onClick={() => fileInputRef?.current?.click()}
            >
              <MdCloudUpload className="text-2xl text-gray-400" />
              <span className="text-sm text-gray-500">
                Drop files to attach or
              </span>
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef?.current?.click();
                }}
              >
                Browse
              </button>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
            </div>

            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className="flex w-full flex-row gap-1 overflow-x-auto">
                {(attachments
                  .map(safeParseAttachment)
                  .filter(
                    (p): p is NonNullable<ReturnType<typeof safeParseAttachment>> => p !== null
                  )
                  .map((parsed) => (
                    <AttachmentCard
                      key={parsed.url}
                      attachment={parsed}
                      handleDeleteAttachment={handleDeleteAttachment}
                    />
                  )))}
              </div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateIssueModal;
