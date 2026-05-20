import React, { useState, useRef, useCallback } from "react";
import { useUpload } from "@libs/hooks/apis/useMetadata";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import "@libs/app/components/projects/modals/modal.css";
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
import PriorityBadge from "@libs/app/components/general-components/badge/priorityBadge";
import TypeBadge from "@libs/app/components/general-components/badge/typeBadge";
import StatusBadge from "@libs/app/components/general-components/badge/statusBadge";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { LuCalendar, LuChevronDown, LuX, LuZap, LuPlus } from "react-icons/lu";
import AttachmentCard from "@libs/app/components/issues/metadataSection/attachmentCard";
import QuillEditorCreate, {
  type QuillEditorCreateRef,
} from "@libs/app/components/issues/metadataSection/quillEditorCreate";
import { useSpeechToText } from "@libs/hooks/common/useSpeechToText";

const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5";

const fieldClass = (hasError?: boolean) =>
  [
    "w-full rounded border px-4 py-2.5 text-sm font-medium outline-none transition-all",
    "bg-white text-gray-700 placeholder:text-gray-400",
    "border-gray-200 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5",
    hasError ? "border-red-300 bg-red-50" : "",
  ].join(" ");

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

  const { upload } = useUpload();
  const isLoading = isCreating || isUpdating;

  // Attachments stored as JSON strings (same format as metadataSection)
  const [attachments, setAttachments] = useState<string[]>([]);
  // Description managed via Quill editor (already stringified as { plainText, delta })
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [showConfirmClose, setShowConfirmClose] = useState(false);

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
    formState: { errors, isDirty },
  } = useForm<IssueFormInputs>({
    resolver: zodResolver(issueSchema),
    defaultValues,
  });

  const summaryValue = watch("summary");

  const handleClose = useCallback(() => {
    const hasSummary = summaryValue && summaryValue.trim().length > 0;
    const hasDescription = descriptionValue && descriptionValue !== "" && descriptionValue.length > 20;
    const hasAttachments = attachments.length > 0;
    const isFormDirty = isDirty || hasDescription || hasAttachments || hasSummary;

    if (isFormDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
      reset();
    }
  }, [isDirty, summaryValue, descriptionValue, attachments, onClose, reset]);

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
      start_date: data.start_date,
      story_point: data.story_point,
      team_id: data.team_id,
    };

    if (isEditing && initialIssue) {
      try {
        updateIssue({ id: initialIssue.id, data: issueData });
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

  // Upload file to S3 and store as JSON string (same as metadataSection)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload({
        project_id: selectedProjectId,
        user_id: user?.id || "",
        file,
        upload_type: "attachment",
      });
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
  const quillEditorRef = useRef<QuillEditorCreateRef>(null);

  // Speech-to-text for description
  const handleSpeechResult = useCallback((finalText: string) => {
    quillEditorRef.current?.insertText(finalText);
  }, []);

  const {
    isListening,
    isSupported: isSpeechSupported,
    toggleListening,
  } = useSpeechToText({
    lang: "en-US",
    continuous: true,
    interimResults: true,
    onResult: handleSpeechResult,
  });


  if (!isOpen) return null;
  return (
    <Modal
      bare
      title=""
      buttonContent=""
      onClose={handleClose}
      onSubmit={() => { }}
      className="w-full max-w-xl glass-panel flex-col rounded-xl border border-white/40 shadow-2xl z-50"
    >
      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-900 text-white">
              <LuPlus className="h-4 w-4" aria-hidden />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-900">
              {isEditing ? "Update Issue" : "Create New Issue"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-900 focus:outline-none"
            aria-label="Close"
          >
            <LuX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-8 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Project Selection */}
            <div>
              <label className={labelClass}>Project</label>
              {projectId ? (
                <div className="rounded-md bg-gray-50/50 border border-gray-100 px-4 py-2.5">
                  <span className="text-sm font-medium text-gray-900">
                    {projects?.find((p) => p.id === watch("project_id"))?.name}
                  </span>
                </div>
              ) : (
                <div className="w-full">
                  {projects?.length > 0 ? (
                    <DropdownAntd
                      options={projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                      }))}
                      placement="bottom"
                      rowClassName="w-full"
                      menuClassName="min-w-[200px]"
                      parent={
                        <button
                          type="button"
                          className={`${fieldClass(!!errors.project_id)} flex items-center justify-between`}
                        >
                          <span>
                            {projects.find((p) => p.id === watch("project_id"))?.name || "Select Project"}
                          </span>
                          <LuChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                      }
                      isShowIcon={false}
                      onClickItem={(option) => {
                        setSelectedProjectId(option.value as string);
                        setValue("project_id", option.value as string);
                      }}
                    />
                  ) : (
                    <p className="text-xs text-gray-500">No projects available.</p>
                  )}
                </div>
              )}
              {errors.project_id && <p className="text-xs text-red-500">{errors.project_id.message}</p>}
            </div>

            {/* Sprint Selection */}
            <div>
              <label className={labelClass}>Sprint</label>
              <div className="w-full">
                {sprintId ? (
                  <div className="rounded-md bg-gray-50/50 border border-gray-100 px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-900">
                      {sprints?.find((s) => s.id === watch("sprint_id"))?.name}
                    </span>
                  </div>
                ) : sprints?.length > 0 ? (
                  <DropdownAntd
                    options={sprints.map((sprint) => ({
                      value: sprint.id,
                      label: sprint.name,
                    }))}
                    placement="bottom"
                    rowClassName="w-full"
                    menuClassName="min-w-[200px]"
                    parent={
                      <button
                        type="button"
                        className={fieldClass()}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <span className="truncate">
                          {sprints.find((s) => s.id === watch("sprint_id"))?.name || "None"}
                        </span>
                        <LuChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    }
                    isShowIcon={false}
                    onClickItem={(option) => setValue("sprint_id", option.value as string)}
                  />
                ) : (
                  <div className="rounded-md bg-gray-50/50 border border-gray-100 px-4 py-2.5 italic text-gray-400 text-xs text-center">
                    No active sprints
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Type */}
            <div>
              <label className={labelClass}>Issue Type</label>
              <DropdownAntd
                options={["Bug", "Task", "Story", "Epic"].map((value) => ({
                  value,
                  label: value,
                  customRender: <TypeBadge type={value as IssueType} />,
                }))}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={`${fieldClass()} flex items-center justify-between`}>
                    <TypeBadge type={watch("type") as IssueType} />
                    <LuChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("type", option.value as IssueType)}
              />
            </div>

            {/* Priority */}
            <div>
              <label className={labelClass}>Priority</label>
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

                      priority={option.value as IssuePriority}
                      isShowLabel={true}
                    />
                  ),
                }))}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={`${fieldClass()} flex items-center justify-between`}>
                    <PriorityBadge

                      priority={watch("priority") as IssuePriority}
                      isShowLabel={true}
                    />
                    <LuChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("priority", option.value as IssuePriority)}
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className={labelClass}>Summary</label>
            <input
              id="summary"
              type="text"
              {...register("summary")}
              className={fieldClass(!!errors.summary)}
              placeholder="What needs to be done?"
            />
            {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Description</label>
              <div className="flex items-center gap-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${isListening ? "bg-red-50 text-red-600 ring-1 ring-red-200" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                  >
                    {isListening ? (
                      <><div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Listening</>
                    ) : (
                      <><LuZap className="w-3 h-3" /> Dictate</>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className={`rounded-md border overflow-hidden transition-all ${isListening ? "border-red-300 ring-4 ring-red-50" : "border-gray-200 focus-within:border-emerald-900 focus-within:ring-2 focus-within:ring-emerald-900/15"}`}>
              <QuillEditorCreate
                ref={quillEditorRef}
                onChange={setDescriptionValue}
                placeholder={isListening ? "Speak now... your words will appear here" : "Add more details about this issue..."}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <DropdownAntd
                options={columns?.map((column) => ({
                  value: column.id,
                  label: column.name,
                  customRender: (
                    <StatusBadge
                      className="border-none! bg-transparent! p-0!"
                      columnId={column.id}
                      projectId={selectedProjectId}
                    />
                  ),
                })) || []}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={`${fieldClass(!!errors.column_id)} flex items-center justify-between`}>
                    <StatusBadge
                      className="border-none! bg-transparent! p-0!"
                      columnId={watch("column_id") as string}
                      projectId={selectedProjectId}
                    />
                    <LuChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("column_id", option.value)}
              />
              {errors.column_id && <p className="text-xs text-red-500">{errors.column_id.message}</p>}
            </div>

            {/* Assignee */}
            <div>
              <label className={labelClass}>Assignee</label>
              <DropdownAntd
                options={projectMembers?.map((member) => ({
                  value: member.user_id,
                  label: member.user_id || "",
                  customRender: (
                    <UserAvatar userId={member.user_id} isDisplayName={true} size={20} />
                  ),
                })) || []}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={fieldClass()}>
                    <div className="flex items-center justify-between w-full">
                      <UserAvatar
                        userId={watch("assignee_id") as string}
                        isDisplayName={true}
                        size={20}
                      />
                      <LuChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("assignee_id", option.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Parent */}
            <div>
              <label className={labelClass}>Parent</label>
              <DropdownAntd
                options={issues?.map((issue) => ({
                  value: issue.id,
                  label: `${issue.key} - ${issue.summary}`,
                })) || []}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={fieldClass()}>
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate text-sm">
                        {issues?.find(i => i.id === watch("parent_id")) ? `${issues.find(i => i.id === watch("parent_id"))?.key} - ${issues.find(i => i.id === watch("parent_id"))?.summary}` : "None"}
                      </span>
                      <LuChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("parent_id", option.value as string)}
              />
            </div>

            {/* Team */}
            <div>
              <label className={labelClass}>Team</label>
              <DropdownAntd
                options={teams?.map((team) => ({
                  value: team.id,
                  label: team.name,
                })) || []}
                placement="bottom"
                rowClassName="w-full"
                parent={
                  <button type="button" className={fieldClass()}>
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">
                        {teams?.find(t => t.id === watch("team_id"))?.name || "None"}
                      </span>
                      <LuChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("team_id", option.value as string)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className={labelClass}>Start date</label>
              <div className="relative">
                <input
                  id="start_date"
                  type="date"
                  {...register("start_date")}
                  className={fieldClass()}
                />
                <LuCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="due_date_to" className={labelClass}>Due date</label>
              <div className="relative">
                <input
                  id="due_date_to"
                  type="date"
                  {...register("due_date_to")}
                  className={fieldClass()}
                />
                <LuCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Story Points */}
            <div>
              <label htmlFor="story_point" className={labelClass}>Story Points</label>
              <input
                id="story_point"
                type="number"
                {...register("story_point", { valueAsNumber: true })}
                className={fieldClass()}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className={labelClass}>Attachments</label>
              {attachments.length > 0 && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                  {attachments.length}
                </span>
              )}
            </div>

            <div
              className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-all  ${attachments.length ? "border-emerald-400 bg-emerald-50/50" : "border-gray-400 hover:border-emerald-400 hover:bg-emerald-50/50"}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                try {
                  const url = await upload({
                    project_id: selectedProjectId,
                    user_id: user?.id || "",
                    file,
                    upload_type: "attachment",
                  });
                  setAttachments((prev) => [...prev, JSON.stringify({
                    url,
                    type: file.type,
                    uploadFrom: "attachment",
                    created_at: new Date().toISOString(),
                  })]);
                } catch {
                  toast.error("Failed to upload attachment");
                }
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 group-hover:ring-emerald-200">
                <LuPlus className="text-xl text-gray-400 group-hover:text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600">Click or drag to upload</p>
                <p className="text-[10px] text-gray-400">Files up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {attachments
                  .map(safeParseAttachment)
                  .filter((p): p is NonNullable<ReturnType<typeof safeParseAttachment>> => p !== null)
                  .map((parsed) => (
                    <AttachmentCard
                      key={parsed.url}
                      attachment={parsed}
                      handleDeleteAttachment={handleDeleteAttachment}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-emerald-900 px-8 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Saving..." : isEditing ? "Update Issue" : "Create Issue"}
          </button>
        </div>
      </form>
      {showConfirmClose && (
        <Modal
          title="Discard changes?"
          variant="warning"
          onClose={() => setShowConfirmClose(false)}
          onSubmit={() => {
            setShowConfirmClose(false);
            onClose();
            reset();
          }}
          buttonContent="Discard"
          style={{
            confirmButtonColor: "!bg-none !bg-red-600 hover:!bg-red-700 !shadow-none",
            textColor: "text-red-600"
          }}
          className="w-full max-w-sm"
        >
          <div className="text-sm text-gray-500 pt-2 leading-relaxed">
            You have unsaved changes in this issue. Are you sure you want to discard them? This action cannot be undone.
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default CreateIssueModal;
