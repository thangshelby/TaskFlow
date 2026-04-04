import React, { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import { ClockLoader } from "react-spinners";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useProjectMembers } from "@libs/hooks/apis/useProjectMember";

const ProjectLayout = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();

  const { user } = useAuthStore();

  const { isLoading: isLoadingMembers } = useProjectMembers({
    project_id: projectId || "",
    email: user?.email || "",
  });

  useUserTeams(projectId || "", user?.id || "", !isLoadingMembers);

  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("isCollapsed") === "true",
  );
  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed.toString());
  }, [isCollapsed]);
  return (
    <div className="flex w-full flex-1 flex-row overflow-hidden">
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} h-full border-r border-gray-200 transition-all duration-200 ease-in-out`}
      >
        <ProjectNavbar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-auto p-6">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <ClockLoader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectLayout;
