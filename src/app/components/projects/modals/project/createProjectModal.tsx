import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { toast } from "react-toastify";
import { LuChevronDown, LuPlus, LuX } from "react-icons/lu";
import {
  useCreateProject,
  useUpdateProject,
} from "@libs/hooks/apis/useProject";
import { useEffect } from "react";
import { IProject } from "@libs/types/project";
import { useAuth } from "@libs/hooks/apis/useAuth";
import "@libs/app/components/projects/modals/modal.css";

interface CreateProjectForm {
  name: string;
  key: string;
  type: "Kanban" | "Scrum";
  access: string;
}

interface CreateProjectRequest extends CreateProjectForm {
  owner_id: string;
}

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  key: z.string().min(1, "Project key is required").max(10),
  type: z.enum(["Kanban", "Scrum"] as const),
  access: z.string().min(1, "Access type is required"),
});

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
  iniProject?: IProject;
}

const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5";

const fieldClass = (hasError?: boolean) =>
  [
    "w-full rounded border px-4 py-2.5 text-sm font-medium outline-none transition-all",
    "bg-white text-gray-700 placeholder:text-gray-400",
    "border-gray-200 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5",
    hasError ? "border-red-300 bg-red-50" : "",
  ].join(" ");

const CreateProjectModal = ({
  isOpen,
  onClose,
  isEditing,
  iniProject,
}: CreateProjectModalProps) => {
  const { user } = useAuth();
  const { updateProject, isLoading: isUpdating } = useUpdateProject({
    onClose: () => {
      onClose();
      reset();
    },
  });
  const { createProject, isLoading: isCreating } = useCreateProject({
    onClose: () => {
      onClose();
      reset();
    },
  });
  const isLoading = isUpdating || isCreating;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      type: "Kanban",
      access: "Private",
    },
  });

  const type = watch("type");
  const access = watch("access");

  const onSubmit = async (formData: CreateProjectForm) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }
    const request: CreateProjectRequest = {
      ...formData,
      owner_id: user.id,
    };
    if (isEditing && iniProject) {
      updateProject({ id: iniProject.id, data: request });
    } else {
      // Create new project
      createProject(request);
    }
  };

  useEffect(() => {
    if (isEditing && iniProject) {
      setValue("name", iniProject.name);
      setValue("key", iniProject.key);
      setValue("type", iniProject.type);
      setValue("access", iniProject.access);
    }
  }, [isEditing, iniProject, setValue]);

  const title = isEditing ? "Update Project" : "Create Project";
  if (!isOpen) return null;
  return (
    <Modal
      bare
      title=""
      onClose={onClose}
      buttonContent=""
      onSubmit={() => {}}
      className="w-full max-w-xl glass-panel flex-col rounded-xl border border-white/40 shadow-2xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-900 text-white">
              <LuPlus className="h-4 w-4" aria-hidden />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-900 focus:outline-none"
            aria-label="Close"
          >
            <LuX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-8 py-8">
          <div>
            <label htmlFor="name" className={labelClass}>
              Project Name
            </label>
            <input
              id="name"
              {...register("name")}
              className={fieldClass(!!errors.name)}
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="key" className={labelClass}>
              Project Key
            </label>
            <input
              id="key"
              {...register("key")}
              className={fieldClass(!!errors.key)}
              placeholder="e.g. PRJ, TASK (max 10 chars)"
            />
            {errors.key && (
              <p className="mt-1 text-sm text-red-500">{errors.key.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className={labelClass}>
                Project Type
              </label>
              <DropdownAntd
                options={[
                  { value: "Kanban", label: "Kanban" },
                  { value: "Scrum", label: "Scrum" },
                ]}
                placement="bottom"
                rowClassName="w-full"
                menuClassName="min-w-[180px]"
                parent={
                  <button
                    type="button"
                    className={`${fieldClass(!!errors.type)} flex items-center justify-between`}
                  >
                    <span>{type}</span>
                    <LuChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) =>
                  setValue("type", option.value as "Kanban" | "Scrum")
                }
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="access" className={labelClass}>
                Access
              </label>
              <DropdownAntd
                options={[
                  { value: "Private", label: "Private" },
                  { value: "Public", label: "Public" },
                ]}
                placement="bottom"
                rowClassName="w-full"
                menuClassName="min-w-[180px]"
                parent={
                  <button
                    type="button"
                    className={`${fieldClass(!!errors.access)} flex items-center justify-between`}
                  >
                    <span>{access}</span>
                    <LuChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                }
                isShowIcon={false}
                onClickItem={(option) => setValue("access", option.value)}
              />
              {errors.access && (
                <p className="mt-1 text-sm text-red-500">{errors.access.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-emerald-900 px-8 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading..." : title}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
