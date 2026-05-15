import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@libs/app/components/general-components/modal/modal";
import { useCreateSprint, useUpdateSprint } from "@libs/hooks/apis/useSprint";
import { LuCalendar, LuChevronDown, LuX, LuZap } from "react-icons/lu";
import { ISprint } from "@libs/types/sprint";
import { IIssue } from "@libs/types/issue";
import "@libs/app/components/projects/modals/modal.css";

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

const labelClass =
  "block text-[10px] font-bold uppercase tracking-widest text-gray-500";

const fieldClass = (hasError?: boolean) =>
  [
    "w-full rounded-md border px-4 py-2.5 text-sm font-medium outline-none transition-all",
    "bg-white text-gray-700 placeholder:text-gray-400",
    "border-gray-200 focus:border-emerald-900 focus:ring-2 focus:ring-emerald-900/15",
    hasError ? "border-red-300 bg-red-50" : "",
  ].join(" ");

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

  useEffect(() => {
    if (isEditing && initialSprint) {
      setValue("name", initialSprint.name);
      setValue("duration", "custom");
      setValue("date_started", initialSprint.date_started.split("T")[0]);
      setValue("date_ended", initialSprint.date_ended.split("T")[0]);
      setValue("goal", initialSprint.goal || "");
    }
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
    { value: "1", label: "1 Week" },
    { value: "2", label: "2 Weeks" },
    { value: "3", label: "3 Weeks" },
    { value: "4", label: "4 Weeks" },
    { value: "custom", label: "Custom" },
  ];

  const modalTitle = isEditing ? "Edit Sprint" : "Create New Sprint";
  const submitLabel = isLoading
    ? "Loading..."
    : isEditing
      ? "Update Sprint"
      : "Create Sprint";

  return (
    <Modal
      bare
      title=""
      buttonContent=""
      onClose={onClose}
      onSubmit={() => { }}
      className="w-full max-w-xl glass-panel flex-col rounded-xl border border-white/40 shadow-2xl"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-900 text-white">
              <LuZap className="h-4 w-4" aria-hidden />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-900">
              {modalTitle}
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
          {/* Sprint name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Sprint name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={fieldClass(!!errors.name)}
              placeholder="e.g. Q4 Performance Phase"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Duration + hint */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelClass}>Duration</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDurationOpen(!isDurationOpen)}
                  className={`${fieldClass()} flex w-full appearance-none items-center justify-between text-left`}
                >
                  <span>
                    {durationOptions.find((opt) => opt.value === selectedDuration)
                      ?.label || "Custom"}
                  </span>
                  <LuChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-gray-400" />
                </button>
                {isDurationOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedDuration(option.value);
                          setValue("duration", option.value);
                          setIsDurationOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${selectedDuration === option.value
                          ? "bg-emerald-50 text-emerald-900"
                          : "text-gray-700"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end pb-1 sm:px-2">
              <p className="text-xs leading-tight text-gray-500 italic">
                Standard engineering cycle for Atelier projects is 2 weeks.
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="date_started" className={labelClass}>
                Start date
              </label>
              <div className="relative">
                <input
                  id="date_started"
                  type="date"
                  {...register("date_started")}
                  className={`${fieldClass(!!errors.date_started)} pr-10`}
                />
                <LuCalendar className="pointer-events-none absolute top-1/2 right-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
              </div>
              {errors.date_started && (
                <p className="text-sm text-red-600">
                  {errors.date_started.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="date_ended" className={labelClass}>
                End date
              </label>
              <div className="relative">
                <input
                  id="date_ended"
                  type="date"
                  {...register("date_ended")}
                  className={`${fieldClass(!!errors.date_ended)} pr-10`}
                />
                <LuCalendar className="pointer-events-none absolute top-1/2 right-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
              </div>
              {errors.date_ended && (
                <p className="text-sm text-red-600">
                  {errors.date_ended.message}
                </p>
              )}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-1.5">
            <label htmlFor="goal" className={labelClass}>
              Sprint goal
            </label>
            <textarea
              id="goal"
              rows={3}
              {...register("goal")}
              className={`${fieldClass()} resize-none`}
              placeholder="What is the objective of this sprint cycle?"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-4 border-t border-gray-200 bg-gray-50/80 px-6 py-6">
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
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSprintModal;
