import React, { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ProjectNavbar from "@libs/app/components/projects/projectNavBar";
import { ClockLoader } from "react-spinners";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";
import { Header } from "@libs/app/components/general-components/user/header";

const ProjectLayout = (): React.ReactElement => {
  const { projectId } = useParams<{ projectId: string }>();

  const { user } = useAuthStore();


  useUserTeams(projectId || "", user?.id || "");

  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("isCollapsed") === "true",
  );
  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed.toString());
  }, [isCollapsed]);
  return (

    <div className="flex w-full h-screen overflow-hidden">
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} h-full transition-all duration-300 ease-in-out`}
      >
        <ProjectNavbar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <Header />
        <div className="flex-1 h-full overflow-auto p-6 bg-[#f9f9f8]/80">
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
    </div>


  );
};

export default ProjectLayout;
