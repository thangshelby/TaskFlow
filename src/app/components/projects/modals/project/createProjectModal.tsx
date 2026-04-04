import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { toast } from "react-toastify";
import {
  useCreateProject,
  useUpdateProject,
} from "@libs/hooks/apis/useProject";
import { useEffect } from "react";
import { IProject } from "@libs/types/project";
import { useAuth } from "@libs/hooks/apis/useAuth";

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
      title="Create Project"
      onClose={onClose}
      buttonContent={isLoading ? "Loading..." : title}
      onSubmit={handleSubmit(onSubmit)}
      className="w-[500px]"
      isLoadingButton={isLoading}
    >
      <div className="space-y-4 p-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="key"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Project Key <span className="text-red-500">*</span>
          </label>
          <input
            id="key"
            {...register("key")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="e.g. PRJ, TASK (max 10 chars)"
          />
          {errors.key && (
            <p className="mt-1 text-sm text-red-500">{errors.key.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Project Type <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={[
                { value: "Kanban", label: "Kanban" },
                { value: "Scrum", label: "Scrum" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">{type}</div>}
              onClickItem={(option) =>
                setValue("type", option.value as "Kanban" | "Scrum")
              }
            />
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="access"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Access <span className="text-red-500">*</span>
            </label>
            <DropdownAntd
              options={[
                { value: "Private", label: "Private" },
                { value: "Public", label: "Public" },
              ]}
              placement="bottom"
              rowClassName="w-full text-[15px]"
              menuClassName="w-[180px]"
              parent={<div className="w-full font-medium">{access}</div>}
              onClickItem={(option) => setValue("access", option.value)}
            />
            {errors.access && (
              <p className="mt-1 text-sm text-red-500">
                {errors.access.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
