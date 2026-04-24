import React from "react";
import { Plus, Settings2, GripVertical, CheckCircle2, Circle, Clock } from "lucide-react";

export const IssueTypesScreen: React.FC = () => {
  const issueTypes = [
    { id: '1', name: 'Story', description: 'Tracks a user story or feature.', icon: 'S', color: 'bg-green-500' },
    { id: '2', name: 'Task', description: 'Tracks a small piece of technical work.', icon: 'T', color: 'bg-blue-500' },
    { id: '3', name: 'Bug', description: 'Tracks a defect or issue.', icon: 'B', color: 'bg-red-500' },
  ];

  const workflowStates = [
    { id: 'todo', name: 'To Do', category: 'To Do', icon: Circle, color: 'text-gray-400' },
    { id: 'in_progress', name: 'In Progress', category: 'In Progress', icon: Clock, color: 'text-blue-500' },
    { id: 'done', name: 'Done', category: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="flex h-full flex-col bg-gray-50/30">
      <div className="mx-auto w-full max-w-5xl px-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Issue Types Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Issue Types</h2>
              <p className="text-sm text-gray-500 mt-1">Configure the types of work your team tracks.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Plus className="h-4 w-4" />
              Add Issue Type
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issueTypes.map(type => (
              <div key={type.id} className="relative group rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-indigo-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded bg-opacity-10 ${type.color.replace('bg-', 'text-')} bg-current`}>
                       <span className={`text-sm font-bold opacity-100 ${type.color}`}>{/* Icon placeholder */}</span>
                       <div className={`h-full w-full rounded ${type.color}`}></div>
                    </div>
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{type.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Workflow States</h2>
              <p className="text-sm text-gray-500 mt-1">Define the lifecycle stages for your issues.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Plus className="h-4 w-4" />
              Add Status
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {workflowStates.map((state) => {
                const Icon = state.icon;
                return (
                  <li key={state.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <GripVertical className="h-4 w-4 text-gray-300 cursor-grab active:cursor-grabbing" />
                    <div className="flex flex-1 items-center gap-3">
                      <Icon className={`h-5 w-5 ${state.color}`} />
                      <span className="font-medium text-gray-900">{state.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {state.category} Category
                      </span>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
