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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto p-2 pr-4 pl-0">
      <FilterSection
        title="LAST UPDATED"
        section="lastUpdated"
        toggleSection={toggleSection}
      >
        <div className="flex flex-wrap gap-2">
          {lastUpdatedOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setValue("lastUpdated", option.value)}
              className={`cursor-pointer rounded-xl border px-2 py-0.5 text-sm font-medium transition-colors ${
                watch("lastUpdated") === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {projects.length > 0 && (
        <FilterSection
          title="FILTER BY PROJECT"
          section="projects"
          toggleSection={toggleSection}
        >
          <div className="space-y-2">
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
              className="text-sm text-blue-600 transition-colors hover:text-blue-700"
              onClick={() =>
                setIsShowMoreFilter({ ...isShowMoreFilter, projects: true })
              }
            >
              Show more
            </button>
          )}
        </FilterSection>
      )}

      {assignees && assignees.length > 0 && (
        <FilterSection
          title="FILTER BY ASSIGNEE"
          section="assignees"
          toggleSection={toggleSection}
        >
          <div className="space-y-2">
            {assignees
              .slice(0, isShowMoreFilter.assignees ? assignees.length : 4)
              .concat()
              .map((assignee) => (
                <div key={assignee.user_id} className="flex items-center gap-2">
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
                  <UserAvatar
                    userId={assignee.user_id}
                    size={24}
                    isDisplayName={true}
                  />
                </div>
              ))}
          </div>
          {assignees && assignees.length > 4 && (
            <button
              type="button"
              className="cursor-pointer text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              onClick={() =>
                setIsShowMoreFilter({
                  ...isShowMoreFilter,
                  assignees: !isShowMoreFilter.assignees,
                })
              }
            >
              {isShowMoreFilter.assignees ? "Show less" : "Show more"}
            </button>
          )}
        </FilterSection>
      )}

      {columns.length > 0 && (
        <FilterSection
          title="FILTER BY STATUS"
          section="statuses"
          toggleSection={toggleSection}
        >
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center gap-2">
                <CheckboxItem
                  key={column.id}
                  checked={isChecked("statuses", column.id)}
                  onChange={(checked) =>
                    handleCheckboxChange("statuses", column.id, checked)
                  }
                ></CheckboxItem>
                <StatusBadge columnId={column.id} projectId={projectId!} />
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
    <div className="pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600"
      >
        {title}
        <ChevronDown
          size={16}
          className={`cursor-pointer transition-transform ${expandedSections[section] ? "rotate-180" : ""}`}
        />
      </button>
      {expandedSections[section] && (
        <div className="mt-1 space-y-2">{children}</div>
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
  <label className="flex cursor-pointer items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="border-border rounded border"
    />
    {label && <span className="text-foreground text-sm">{label}</span>}
  </label>
);
