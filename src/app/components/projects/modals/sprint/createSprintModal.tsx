import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useCreateSprint, useUpdateSprint } from "@libs/hooks/apis/useSprint";
import { LuCalendar, LuClock, LuChevronDown } from "react-icons/lu";
import { ISprint } from "@libs/types/sprint";
import { IIssue } from "@libs/types/issue";
interface ISprintIssues extends ISprint {
  issues: IIssue[];
}
interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  isEditing?: boolean;
  initialSprint?: ISprint | null | ISprintIssues;
}

const sprintSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    duration: z.string().min(1, "Duration is required"),
    date_started: z.string().min(1, "Start date is required"),
    date_ended: z.string().min(1, "End date is required"),
    goal: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.date_started && data.date_ended) {
      const startDate = new Date(data.date_started);
      const endDate = new Date(data.date_ended);
      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["date_ended"],
        });
      }
    }
  });

type SprintFormData = z.infer<typeof sprintSchema>;

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  projectId,
  isEditing,
  initialSprint,
}) => {
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("custom");

  const { createSprint, isLoading: isCreating } = useCreateSprint({
    projectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const { updateSprint, isLoading: isUpdating } = useUpdateSprint({
    projectId,
    onClose: () => {
      onClose();
      reset();
    },
  });

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: "",
      duration: "custom",
      date_started: "",
      date_ended: "",
      goal: "",
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && initialSprint) {
      setValue("name", initialSprint.name);
      setValue("duration", "custom");
      setValue("date_started", initialSprint.date_started.split("T")[0]);
      setValue("date_ended", initialSprint.date_ended.split("T")[0]);
      setValue("goal", initialSprint.goal || "");
    }

    console.log(initialSprint);
  }, [isEditing, initialSprint, setValue]);

  const handleFormSubmit: SubmitHandler<SprintFormData> = async (data) => {
    const sprintData = {
      ...data,
      date_started: new Date(data.date_started).toISOString(),
      date_ended: new Date(data.date_ended).toISOString(),
      goal: data.goal || "",
      duration: Math.ceil(
        (new Date(data.date_ended).getTime() -
          new Date(data.date_started).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    };

    if (isEditing && initialSprint) {
      updateSprint({ id: initialSprint.id, data: sprintData });
    } else {
      createSprint({ ...sprintData, project_id: projectId });
    }
  };

  if (!isOpen) return null;

  const durationOptions = [
    { value: "1", label: "1 week" },
    { value: "2", label: "2 weeks" },
    { value: "3", label: "3 weeks" },
    { value: "4", label: "4 weeks" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <Modal
      title={
        isEditing
          ? `Edit sprint: ${initialSprint?.name || ""}`
          : "Create sprint"
      }
      onClose={onClose}
      buttonContent={isLoading ? "Loading..." : isEditing ? "Update" : "Create"}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(handleFormSubmit)(e);
      }}
      isLoadingButton={isLoading}
      className="max-w-2xl"
    >
      <div className="px-1">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Required fields are marked with an asterisk{" "}
            <span className="text-red-500">*</span>
          </p>
        </div>

        <form className="space-y-4">
          {/* Sprint Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sprint name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Enter sprint name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Duration
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <span className="flex items-center justify-between">
                  {durationOptions.find((opt) => opt.value === selectedDuration)
                    ?.label || "Custom"}
                  <LuChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isDurationOpen && (
                <div className="absolute z-10 mt-1 w-full rounded border border-gray-300 bg-white shadow-lg">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(option.value);
                        setValue("duration", option.value);
                        setIsDurationOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        selectedDuration === option.value
                          ? "bg-blue-50 text-blue-700"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="date_started"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Start date <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LuCalendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="date_started"
                  type="date"
                  {...register("date_started")}
                  className={`w-full rounded border py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.date_started
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <div className="relative flex-1">
                <LuClock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full rounded border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            {errors.date_started && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_started.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="date_ended"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              End date <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LuCalendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="date_ended"
                  type="date"
                  {...register("date_ended")}
                  className={`w-full rounded border py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.date_ended
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </div>
              <div className="relative flex-1">
                <LuClock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="time"
                  defaultValue="17:00"
                  className="w-full rounded border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            {errors.date_ended && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_ended.message}
              </p>
            )}
          </div>

          {/* Sprint Goal */}
          <div>
            <label
              htmlFor="goal"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Sprint goal
            </label>
            <textarea
              id="goal"
              {...register("goal")}
              className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="What do you want to achieve in this sprint?"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSprintModal;
