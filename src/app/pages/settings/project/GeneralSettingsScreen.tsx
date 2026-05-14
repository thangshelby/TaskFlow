import React, { useState } from "react";
import { Flag, Save, Info, Image as ImageIcon } from "lucide-react";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";

export const GeneralSettingsScreen: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [project] = useState<any>({
    name: "TaskFlow MVP",
    key: "TASK",
    description: "Main workspace for TaskFlow project",
    type: "Scrum",
    access: "Private",
    owner_id: "user_1",
  });

  const onSave = (_data: any) => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1000);
  };

  const [formData, setFormData] = useState({
    name: project?.name || "",
    key: project?.key || "",
    description: project?.description || "",
    type: project?.type || "Scrum",
    access: project?.access || "Public",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="mx-auto w-full max-w-3xl px-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10 flex flex-col items-center">
          <div className="group relative mb-4 flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-sm transition-transform hover:scale-105">
            <Flag className="h-10 w-10 text-white" />
            <div className="absolute inset-0 flex rounded-xl bg-black/40 items-center justify-center text-white opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all">
              <ImageIcon size={24} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{formData.name || 'Project Name'}</h2>
          <p className="text-sm text-gray-500 mt-1">Key: {formData.key || 'KEY'}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name *</label>
              <input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Space Key *
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <input
                value={formData.key}
                onChange={(e) => handleInputChange("key", e.target.value.toUpperCase())}
                className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter space key"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Scrum">Scrum</option>
                <option value="Kanban">Kanban</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Access Level</label>
              <select
                value={formData.access}
                onChange={(e) => handleInputChange("access", e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Public">Public (Workspace)</option>
                <option value="Private">Private (Invite Only)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Space Owner</label>
            <div className="mt-2 flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
              <UserAvatar userId={project?.owner_id} size={36} isDisplayName />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-md border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="What is this project about?"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onSave(formData)}
              disabled={isUpdating}
              className={`inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors ${
                isUpdating ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <Save className="h-4 w-4" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
