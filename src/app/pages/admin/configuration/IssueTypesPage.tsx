import React from "react";
import { Tag, Plus, Edit, ToggleLeft, ToggleRight, Bug, BookOpen, CheckSquare, Layers, Star, Zap } from "lucide-react";

interface IssueType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  active: boolean;
  isDefault: boolean;
}

const DEFAULT_ISSUE_TYPES: IssueType[] = [
  { id: "1", name: "Epic", icon: <Layers className="h-5 w-5" />, color: "text-violet-600", bgColor: "bg-violet-100", description: "Large body of work that can be broken down", active: true, isDefault: true },
  { id: "2", name: "Story", icon: <BookOpen className="h-5 w-5" />, color: "text-blue-600", bgColor: "bg-blue-100", description: "Short requirement from user perspective", active: true, isDefault: true },
  { id: "3", name: "Task", icon: <CheckSquare className="h-5 w-5" />, color: "text-emerald-600", bgColor: "bg-emerald-100", description: "A unit of work that needs to be done", active: true, isDefault: true },
  { id: "4", name: "Bug", icon: <Bug className="h-5 w-5" />, color: "text-red-600", bgColor: "bg-red-100", description: "A problem or error that needs to be fixed", active: true, isDefault: true },
  { id: "5", name: "Sub-task", icon: <Star className="h-5 w-5" />, color: "text-amber-600", bgColor: "bg-amber-100", description: "A child task of a parent issue", active: true, isDefault: true },
  { id: "6", name: "Feature Request", icon: <Zap className="h-5 w-5" />, color: "text-teal-600", bgColor: "bg-teal-100", description: "Request for a new feature or enhancement", active: false, isDefault: false },
];

const IssueTypesPage: React.FC = () => {
  const [types, setTypes] = React.useState(DEFAULT_ISSUE_TYPES);

  const toggleActive = (id: string) => {
    setTypes((prev) =>
      prev.map((t) => (t.id === id && !t.isDefault ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issue Types</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define the types of issues available across all projects.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all">
          <Plus className="h-4 w-4" />
          Add Issue Type
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <strong>Phase 2:</strong> Full CRUD for issue types including custom icon picker, color picker, and drag-to-reorder will be available in Phase 2. Currently showing system defaults.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {types.map((type) => (
          <div
            key={type.id}
            className={`rounded-2xl border p-5 transition-all ${
              type.active
                ? "border-slate-200 bg-white shadow-sm"
                : "border-slate-100 bg-slate-50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${type.bgColor} ${type.color}`}>
                  {type.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">{type.name}</h3>
                    {type.isDefault && (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{type.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleActive(type.id)}
                  disabled={type.isDefault}
                  className={`rounded-md p-1.5 transition-colors ${
                    type.isDefault
                      ? "text-slate-200 cursor-not-allowed"
                      : type.active
                      ? "text-emerald-500 hover:bg-emerald-50"
                      : "text-slate-400 hover:bg-slate-100"
                  }`}
                  title={type.isDefault ? "Default types cannot be deactivated" : "Toggle active"}
                >
                  {type.active ? (
                    <ToggleRight className="h-5 w-5" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueTypesPage;
