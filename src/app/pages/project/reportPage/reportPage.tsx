import IssueAnalytics from "@libs/app/components/projects/report/IssueAnalytics";
import MetricCards from "@libs/app/components/projects/report/MetricCards";
import StatusOverview from "@libs/app/components/projects/report/StatusOverview";
import { useProjectSummary } from "@libs/hooks/apis/useProject";
import React from "react";
import { useParams } from "react-router-dom";
// import TeamOverview from "./components/TeamOverview";

const ReportPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId as string;

  const { summary } = useProjectSummary({ project_id: projectId });
  const haveStats = summary;
  return (
    <div className="mb-32 w-full space-y-8 font-manrope">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#064e3b]">
          Project Summary
        </h1>
        <p className="mt-1 text-sm text-[#404944] opacity-70">
          Overview of project status and metrics
        </p>
      </div>

      {haveStats && (
        <div className="flex h-full flex-col gap-10">
          {/* Section 1: Key Metrics */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MetricCards data={summary} />
          </section>

          {/* Section 2: Status Overview & Activity */}
          <section className="h-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <StatusOverview data={summary} />
          </section>

          {/* Section 3: Issue Analytics */}
          <section className="h-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <IssueAnalytics data={summary} />
          </section>
        </div>
      )}

    </div>
  );
};

export default ReportPage;
