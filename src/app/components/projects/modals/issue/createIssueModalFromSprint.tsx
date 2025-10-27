import React, { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import { CreateIssueParams, IssuePriority, IssueType } from "@libs/types/issue";

import { useAuthStore } from "@libs/store/useAuthStore";

interface CreateIssueModalFromSprintProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CreateIssueParams>) => Promise<void>;
  projectId: string;
  sprintId: string;
}

const FileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Must be a file",
});

const issueSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  sprintId: z.string().min(1, "Sprint is required"),
  type: z.enum(["Bug", "Task", "Story", "Epic"]),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  column_id: z.string().min(1, "Column is required"),
  assignee_id: z.string().optional(),
  priority: z.enum(["Lowest", "Low", "Medium", "High", "Highest"] as const),
  attachments: z.array(FileSchema),
});

type IssueFormData = z.infer<typeof issueSchema>;

type ErrorResponse = {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
};

const CreateIssueModalFromSprint: React.FC<CreateIssueModalFromSprintProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  sprintId,
}) => {
  const { columns = [] } = useProjectColumns({ project_id: projectId });
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Get initial column_id
  const initialColumnId = React.useMemo(() => {
    return columns.length > 0 ? columns[0].id : "";
  }, [columns]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      projectId,
      sprintId,
      type: "Task",
      column_id: initialColumnId,
      priority: "Medium",
      attachments: [],
    },
  });

  const type = watch("type");
  const column_id = watch("column_id");
  const priority = watch("priority");
  const files = watch("attachments");

  React.useEffect(() => {
    // Set default column_id when columns are loaded
    if (columns.length > 0 && !column_id) {
      setValue("column_id", columns[0].id);
    }
  }, [columns, setValue, column_id]);

  console.log("Form values:", {
    type,
    column_id,
    priority,
    columns,
  });

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

  const handleFormSubmit: SubmitHandler<IssueFormData> = async (formData) => {
    if (!user?.id) {
      console.error("No user found");
      return;
    }

    console.log("Submitting form data:", formData);

    // Find the selected column and ensure it has project_id
    const selectedColumn = columns.find((col) => col.id === formData.column_id);
    if (!selectedColumn) {
      console.error("Selected column not found");
      return;
    }

    // Set project_id in the selected column
    selectedColumn.project_id = projectId;

    const issueData = {
      title: formData.title,
      summary: formData.summary,
      description: formData.description || "",
      type: formData.type,
      column_id: selectedColumn.id,
      priority: formData.priority,
      project_id: projectId,
      sprint_id: sprintId,
      reporter_id: user.id,
    };

    // Log the request data
    console.log("Sending to API:", issueData);

    setIsLoading(true);
    try {
      await onSubmit(issueData);
    } catch (error) {
      console.error("Failed to create issue:", error);
      // Check for specific error response
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as ErrorResponse).response;
        console.error("Server error details:", {
          status: response?.status,
          data: response?.data,
          message: response?.data?.message,
        });
        toast.error(
          response?.data?.message ||
            "Failed to create issue. Please try again.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Create Issue"
      onClose={onClose}
      buttonContent={isLoading ? "Creating..." : "Create Issue"}
      onSubmit={handleSubmit(handleFormSubmit)}
      isLoadingButton={isLoading}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
        <form className="space-y-4">
          <div className="mb-6 gap-4">
            <div>
              <label
                htmlFor="type"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <DropdownAntd
                options={[
                  { value: "Bug", label: "Bug" },
                  { value: "Task", label: "Task" },
                  { value: "Story", label: "Story" },
                  { value: "Epic", label: "Epic" },
                ]}
                placement="bottom"
                rowClassName="w-full text-[15px]"
                menuClassName="w-[380px]"
                parent={<div className="w-full">{type}</div>}
                onClickItem={(option) =>
                  setValue("type", option.value as IssueType)
                }
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="summary"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Summary <span className="text-red-500">*</span>
            </label>
            <input
              id="summary"
              {...register("summary")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-500">
                {errors.summary.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="column"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={columns.map((column) => ({
                value: column.id,
                label: column.name,
              }))}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={
                <div className="w-full font-medium">
                  {columns.find((c) => c.id === column_id)?.name ||
                    "Select Status"}
                </div>
              }
              onClickItem={(option) => setValue("column_id", option.value)}
            />
            {errors.column_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.column_id.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <DropdownAntd
              options={[
                { value: "Lowest", label: "Lowest" },
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Highest", label: "Highest" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[380px]"
              parent={<div className="w-full">{priority}</div>}
              onClickItem={(option) =>
                setValue("priority", option.value as IssuePriority)
              }
            />
            {errors.priority && (
              <p className="mt-1 text-sm text-red-500">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="assignee"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Assignee (Optional)
            </label>
            <DropdownAntd
              options={[
                { value: "user1", label: "User 1" },
                { value: "user2", label: "User 2" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[380px]"
              parent={<div className="w-full">Select Assignee (Optional)</div>}
              onClickItem={(option) => setValue("assignee_id", option.value)}
            />
            {errors.assignee_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.assignee_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div
              className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${files?.length ? "border-green-500 bg-green-50" : "hover:border-green-500 hover:bg-green-50"}`}
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
                {files?.length
                  ? "Drop files here or click to replace"
                  : "Drag & drop files here, or click to select files"}
              </p>
            </div>
            {files?.length > 0 && (
              <div className="mt-2">
                <ul className="list-disc pl-5">
                  {files.map((file: File, index: number) => (
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

export default CreateIssueModalFromSprint;
