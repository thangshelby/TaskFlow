import { useUserProjects } from "@libs/hooks/apis/useProject";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";
import { ChevronDown } from "lucide-react";
import UserAvatar from "../user/userAvatar";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { z } from "zod";
import { useProjectColumns } from "@libs/hooks/apis/useProject";
import StatusBadge from "../badge/statusBadge";
// Form schema definition
const filterFormSchema = z.object({
  lastUpdated: z.string().optional(),
  projects: z.array(z.string()),
  assignees: z.array(z.string()),
  reporters: z.array(z.string()),
  statuses: z.array(z.string()),
  labels: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterFormSchema>;

const expandedSections = {
  lastUpdated: true,
  projects: true,
  assignees: true,
  reporters: true,
  statuses: true,
  labels: true,
};
const lastUpdatedOptions = [
  {
    label: "Any time",
    value: "any_time",
  },
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "Past 7 days",
    value: "past_7_days",
  },
  {
    label: "30 days",
    value: "past_30_days",
  },
  {
    label: "3 months",
    value: "past_3_months",
  },
];

const ElacticSearchFilter = ({
  watch,
  setValue,
}: {
  register: UseFormRegister<FilterFormData>;
  watch: UseFormWatch<FilterFormData>;
  setValue: UseFormSetValue<FilterFormData>;
  reset: UseFormReset<FilterFormData>;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    lastUpdated: true,
    projects: true,
    assignees: true,
    reporters: true,
    statuses: true,
    labels: true,
  });
  const [isShowMoreFilter, setIsShowMoreFilter] = useState({
    assignees: false,
    projects: false,
    statuses: false,
    reporters: false,
    labels: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [section as keyof typeof expandedSections]:
        !prev[section as keyof typeof expandedSections],
    }));
  };

  const { projectId } = useParams();
  const { projectMembers } = useProjectMembers({ project_id: projectId || "" });
  const { columns } = useProjectColumns({ project_id: projectId! });

  const assignees = projectMembers?.map((member) => ({
    user_id: member.user_id,
  }));

  const { projects } = useUserProjects();

  // Helper function to handle checkbox changes
  const handleCheckboxChange = (
    field: keyof FilterFormData,
    value: string,
    checked: boolean,
  ) => {
    const currentValues = watch(field) as string[];
    if (checked) {
      setValue(field, [...currentValues, value]);
    } else {
      setValue(
        field,
        currentValues.filter((item) => item !== value),
      );
    }
  };

  // Helper function to check if a value is selected
  const isChecked = (field: keyof FilterFormData, value: string) => {
    const currentValues = watch(field) as string[];
    return currentValues.includes(value);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto p-2 space-y-2 custom-scrollbar">
      <FilterSection
        title="Last Updated"
        section="lastUpdated"
        toggleSection={toggleSection}
      >
        <div className="flex flex-wrap gap-2.5 pt-1">
          {lastUpdatedOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setValue("lastUpdated", option.value)}
              className={`cursor-pointer rounded-md border px-2 py-0.5 text-[9px] font-black transition-all uppercase tracking-wider ${watch("lastUpdated") === option.value
                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
                : "border-emerald-100 bg-white text-emerald-900/40 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {projects.length > 0 && (
        <FilterSection
          title="Filter by Project"
          section="projects"
          toggleSection={toggleSection}
        >
          <div className="space-y-1.5 pt-1">
            {projects.slice(0, 4).map((project) => (
              <CheckboxItem
                key={project.id}
                label={`${project.name}`}
                checked={isChecked("projects", project.id)}
                onChange={(checked) =>
                  handleCheckboxChange("projects", project.id, checked)
                }
              />
            ))}
          </div>
          {projects.length > 4 && (
            <button
              type="button"
              className="mt-1 text-[10px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-[0.15em] cursor-pointer"
              onClick={() =>
                setIsShowMoreFilter({ ...isShowMoreFilter, projects: true })
              }
            >
              + {projects.length - 4} more projects
            </button>
          )}
        </FilterSection>
      )}

      {assignees && assignees.length > 0 && (
        <FilterSection
          title="Filter by Assignee"
          section="assignees"
          toggleSection={toggleSection}
        >
          <div className="space-y-1.5 pt-1">
            {assignees
              .slice(0, isShowMoreFilter.assignees ? assignees.length : 4)
              .map((assignee) => (
                <div key={assignee.user_id} className="flex items-center gap-2 group">
                  <CheckboxItem
                    checked={isChecked("assignees", assignee.user_id)}
                    onChange={(checked) =>
                      handleCheckboxChange(
                        "assignees",
                        assignee.user_id,
                        checked,
                      )
                    }
                  />
                  <div className="transition-all group-hover:translate-x-1">
                    <UserAvatar
                      userId={assignee.user_id}
                      size={24}
                      isDisplayName={true}
                    />
                  </div>
                </div>
              ))}
          </div>
          {assignees && assignees.length > 4 && (
            <button
              type="button"
              className="mt-1 cursor-pointer text-[9px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-[0.15em]"
              onClick={() =>
                setIsShowMoreFilter({
                  ...isShowMoreFilter,
                  assignees: !isShowMoreFilter.assignees,
                })
              }
            >
              {isShowMoreFilter.assignees ? "Show less" : `+ ${assignees.length - 4} more assignees`}
            </button>
          )}
        </FilterSection>
      )}

      {columns.length > 0 && (
        <FilterSection
          title="Filter by Status"
          section="statuses"
          toggleSection={toggleSection}
        >
          <div className="space-y-1.5 pt-1">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center gap-2 group">
                <CheckboxItem
                  key={column.id}
                  checked={isChecked("statuses", column.id)}
                  onChange={(checked) =>
                    handleCheckboxChange("statuses", column.id, checked)
                  }
                ></CheckboxItem>
                <div className="transition-all group-hover:translate-x-1 scale-90 origin-left">
                  <StatusBadge columnId={column.id} projectId={projectId!} />
                </div>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
};

export default ElacticSearchFilter;

const FilterSection = ({
  title,
  section,
  children,
  toggleSection,
}: {
  title: string;
  section: keyof typeof expandedSections;
  children: React.ReactNode;
  toggleSection: (section: string) => void;
}) => {
  return (
    <div className="pb-2">
      <button
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between py-1 transition-all group cursor-pointer"
      >
        <span className="font-headline text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-colors">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-emerald-200 group-hover:text-emerald-600 transition-all ${expandedSections[section] ? "rotate-180" : ""}`}
        />
      </button>
      {expandedSections[section] && (
        <div className="">{children}</div>
      )}
    </div>
  );
};
const CheckboxItem = ({
  label,
  checked,
  onChange,
}: {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center gap-3 group">
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer h-4 w-4 cursor-pointer appearance-none rounded-md border-2 border-emerald-100 bg-white transition-all checked:bg-emerald-600 checked:border-emerald-600 hover:border-emerald-400 shadow-sm"
      />
      <svg
        className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    {label && (
      <span className="text-xs font-bold text-emerald-950 group-hover:text-emerald-600 transition-colors">
        {label}
      </span>
    )}
  </label>
);



