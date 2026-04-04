import IssueAnalytics from "@libs/app/components/projects/report/IssueAnalytics";
import MetricCards from "@libs/app/components/projects/report/MetricCards";
import StatusOverview from "@libs/app/components/projects/report/StatusOverview";
import { useGetUserStats } from "@libs/hooks/apis/useUser";
import React from "react";
import { useParams } from "react-router-dom";
// import TeamOverview from "./components/TeamOverview";

const ReportPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId as string;

  const { stats } = useGetUserStats(projectId, false);
  const haveStats = stats?.data;
  return (
    <div className="mb-32 w-full space-y-4 px-56">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Project Summary
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of project status and metrics
        </p>
      </div>

      {haveStats && (
        <div className="flex h-full flex-col gap-4 text-gray-500">
          {/* Section 1: Key Metrics */}
          <section className="">
            <MetricCards data={stats.data} />
          </section>

          {/* Section 2: Status Overview & Activity */}
          <section className="h-auto">
            <StatusOverview data={stats.data} />
          </section>

          {/* Section 3: Issue Analytics */}
          <section className="h-80">
            <IssueAnalytics data={stats.data} />
          </section>
        </div>
      )}

      {/* Section 4: Team Overview */}
      {/* <section>
        <TeamOverview />
      </section> */}
    </div>
  );
};

export default ReportPage;
