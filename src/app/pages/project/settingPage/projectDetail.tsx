import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flag, MoreHorizontal, Info, Save } from "lucide-react";
import { useProjectByID, useUpdateProject } from "@libs/hooks/apis/useProject";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { toast } from "react-toastify";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading } = useProjectByID(projectId || "");
  const { updateProject, isLoading: isUpdating } = useUpdateProject({
    onClose: () => toast.success("Project updated successfully!"),
  });

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    type: "Scrum" as "Scrum" | "Kanban",
    access: "Public",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        key: project.key || "",
        description: project.description || "",
        type: project.type || "Scrum",
        access: project.access || "Public",
      });
    }
  }, [project]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!projectId) return;
    try {
      await updateProject({
        id: projectId,
        data: formData,
      });
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Project not found
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Details</h1>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-10 py-10">
        {/* Icon + Change button */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400">
            <Flag className="h-10 w-10 text-white" />
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Change icon
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Required fields are marked with an asterisk *
          </p>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Name *</label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter project name"
            />
          </div>

          {/* Key */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              Space key *
              <Info className="h-4 w-4 text-gray-400" />
            </label>
            <input
              value={formData.key}
              onChange={(e) =>
                handleInputChange("key", e.target.value.toUpperCase())
              }
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter space key"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Scrum">Scrum</option>
              <option value="Kanban">Kanban</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Space owner
            </label>
            <div className="mt-1 flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
              <UserAvatar userId={project.owner_id} size={32} isDisplayName />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Make sure your space lead has access to work items in the space.
            </p>
          </div>

          {/* Default Assignee */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Default assignee
            </label>
            <select className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="unassigned">Unassigned</option>
              <option value="project-lead">Project Lead</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter project description"
            />
          </div>

          {/* Access */}
          <div>
            <label className="text-sm font-medium text-gray-700">Access</label>
            <select
              value={formData.access}
              onChange={(e) => handleInputChange("access", e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Save button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${isUpdating
                  ? "bg-gray-300 text-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <Save className="h-4 w-4" />
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        >
          <div className="absolute top-20 right-10 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Export project
            </button>
            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Archive project
            </button>
            <div className="my-1 border-t border-gray-200"></div>
            <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Delete project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
