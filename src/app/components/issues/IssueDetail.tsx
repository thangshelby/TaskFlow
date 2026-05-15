import { useRef, lazy, useMemo, useCallback } from "react";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useIssue } from "@libs/hooks/apis/useIssue";
import { useParams } from "react-router-dom";
import { useIssueStore } from "@libs/store/useIssueStore";
import IssueDetailSkeleton from "../skeleton/issueDetailSkeleton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useElementSize } from "@libs/hooks/common/useElementSize";
import { useAuthStore } from "@libs/store/useAuthStore";
import { useUserTeamStore } from "@libs/store/useProjectStore";
import { PermissionContext } from "@libs/app/context/permission.context";
import { usePermission } from "@libs/hooks/common/usePermission";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import TypeBadge from "../general-components/badge/typeBadge";

//lazy load
const Details = lazy(() => import("./detailsSection/detailsSection"));
const ActivityIssue = lazy(() => import("./activitySection/activitySection"));
const MetadataSection = lazy(() => import("./metadataSection/metadataSection"));

const IssueDetail = ({ selectedIssueId }: { selectedIssueId: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore();
  const { projectId } = useParams<{ projectId: string }>();
  const { closeIssueDetail } = useIssueStore();
  const { issue: selectedIssue, isLoading: isLoadingIssue } = useIssue(
    projectId!,
    selectedIssueId,
  );

  const [_, setSearchParams] = useSearchParams();
  const { userTeams } = useUserTeamStore();
  const permissionResult = usePermission({
    user: user!,
    action: PERMISSIONS_CONFIG.issue.update,
    resource: { issue: { issue: selectedIssue!, teams: userTeams! } },
  });
  const hideSideBarDetailIssue = useCallback(() => {
    closeIssueDetail();
  }, [closeIssueDetail]);

  const IssueDetailHeader = useMemo(
    () => [
      {
        key: "close",
        icon: <IoIosClose />,
        label: "Close Issue",
        onClick: () => {
          hideSideBarDetailIssue();
          setSearchParams({});
        },
      },
    ],
    [hideSideBarDetailIssue, setSearchParams],
  );

  const layout = useElementSize(ref, selectedIssue);
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  const handleUpdateIssue = async (key: string, value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue!.id,
        data: {
          [key]: value,
        },
      });
    } catch {
      toast.error("Failed to update issue");
    }
  };

  if (isLoadingIssue || !selectedIssue) {
    return <IssueDetailSkeleton />;
  }
  return (
    // <Suspense fallback={<IssueDetailSkeleton />}>
    <div
      ref={ref}
      className={`z-30 flex h-full w-full flex-1 flex-col gap-0 overflow-y-auto border-l border-[#064e3b]/5 bg-white transition-all duration-300 font-manrope`}
    >
      <PermissionContext.Provider value={permissionResult}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#064e3b]/5 bg-[#fcfcfb]/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#064e3b]/5 rounded-md border border-[#064e3b]/10">
              <TypeBadge isShowLabel={false} type={selectedIssue?.type} />
              <span className="text-[11px] font-black text-[#064e3b] uppercase tracking-widest">
                {selectedIssue?.key}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            {IssueDetailHeader.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                title={item.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#064e3b]/60 hover:bg-[#064e3b]/5 hover:text-[#064e3b] transition-all border border-transparent hover:border-[#064e3b]/10 active:scale-90"
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {layout === "horizontal" ? (
            <PanelGroup
              autoSaveId="issue-detail-panels"
              className="flex-1"
              direction="horizontal"
            >
              <Panel defaultSize={40} minSize={30}>
                <div className="h-full overflow-y-auto px-6 py-6 border-r border-[#064e3b]/5">
                  <Details
                    projectId={selectedIssue!.project_id}
                    selectedIssue={selectedIssue!}
                    handleUpdateIssue={handleUpdateIssue}
                    layout={"vertical"}
                  />
                  <div className="mt-8 pt-8 border-t border-[#064e3b]/5">
                    <ActivityIssue issueId={selectedIssue?.id || ""} />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className="w-px bg-[#064e3b]/5 hover:bg-[#064e3b]/20 transition-colors cursor-col-resize" />
              <Panel defaultSize={60} minSize={40}>
                <div className="h-full overflow-y-auto px-8 py-6 bg-[#fcfcfb]/30">
                  <MetadataSection
                    selectedIssue={selectedIssue!}
                    handleUpdateIssue={handleUpdateIssue}
                    fileInputRef={fileInputRef}
                  />
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            <div className="flex flex-col gap-8 px-6 py-6 overflow-y-auto">
              <MetadataSection
                selectedIssue={selectedIssue}
                fileInputRef={fileInputRef}
                handleUpdateIssue={handleUpdateIssue}
              />

              <div className="pt-4 border-t border-[#064e3b]/5">
                <Details
                  projectId={projectId || ""}
                  selectedIssue={selectedIssue}
                  handleUpdateIssue={handleUpdateIssue}
                  layout={"vertical"}
                />
              </div>

              <div className="pt-8 border-t border-[#064e3b]/5">
                <ActivityIssue issueId={selectedIssue?.id || ""} />
              </div>
            </div>
          )}
        </div>
      </PermissionContext.Provider>
    </div>
    // </Suspense>
  );
};

export default IssueDetail;
