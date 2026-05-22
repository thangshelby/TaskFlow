import React from "react";
import { AlertTriangle, Settings } from "lucide-react";

const ComingSoonPage: React.FC<{ title: string; description: string; phase: string }> = ({
  title,
  description,
  phase,
}) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
        <Settings className="h-8 w-8 text-slate-300" />
      </div>
      <p className="text-base font-semibold text-slate-600">{title}</p>
      <p className="mt-1 text-sm text-slate-400 max-w-xs">{description}</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs font-medium text-amber-700">{phase}</span>
      </div>
    </div>
  </div>
);

export const PrioritiesPage: React.FC = () => (
  <ComingSoonPage
    title="Priority Configuration"
    description="Define and reorder issue priority levels (Highest, High, Medium, Low, Lowest) with custom colors and icons."
    phase="Phase 2 — Coming Soon"
  />
);

export const StatusesPage: React.FC = () => (
  <ComingSoonPage
    title="Status Configuration"
    description="Configure global status categories (To Do, In Progress, Done) and add custom statuses mapped to each category."
    phase="Phase 2 — Coming Soon"
  />
);

export const WorkflowsPage: React.FC = () => (
  <ComingSoonPage
    title="Workflow Templates"
    description="Visually design workflow templates with nodes (statuses) and transitions (arrows) including condition rules."
    phase="Phase 2 — Coming Soon"
  />
);
