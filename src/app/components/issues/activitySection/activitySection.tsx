import { useState, lazy, useTransition } from "react";
const Comment = lazy(
  () => import("@libs/app/components/issues/activitySection/comment"),
);
const History = lazy(
  () => import("@libs/app/components/issues/activitySection/history"),
);
import { useParams } from "react-router-dom";
import { useAuthStore } from "@libs/store/useAuthStore";

export default function ActivityIssue(props: { issueId: string }) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const { user } = useAuthStore();
  const { projectId } = useParams<{ projectId: string }>();
  const [, startTransition] = useTransition();

  return (
    <div className="bg-transparent font-manrope">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[11px] font-black text-[#064e3b]/60 uppercase tracking-widest">Recent Activity</h2>
        <div className="flex items-center space-x-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#064e3b]/60 hover:bg-[#064e3b]/5 hover:text-[#064e3b] transition-all border border-transparent hover:border-[#064e3b]/10 active:scale-90">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-1 p-1 bg-[#064e3b]/5 rounded-lg border border-[#064e3b]/5">
          {["All", "Comments", "History", "Work log"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                startTransition(() => {
                  setActiveTab(tab);
                });
              }}
              className={`flex-1 cursor-pointer px-3 py-1.5 text-xs font-black rounded-md transition-all transform active:scale-95 ${
                activeTab === tab
                  ? "bg-white text-[#064e3b] shadow-sm border border-[#064e3b]/10"
                  : "text-[#064e3b]/60 hover:text-[#064e3b] hover:bg-white/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[200px]">
        {activeTab === "All" && projectId && (
          <History issueId={props.issueId} projectId={projectId} />
        )}
        {activeTab === "Comments" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {user && (
              <Comment
                issueId={props.issueId}
                currentUserId={user.id}
                currentUserName={user.first_name + " " + user.last_name}
              />
            )}
          </div>
        )}
        {activeTab === "History" && projectId && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <History issueId={props.issueId} projectId={projectId} />
          </div>
        )}
        {activeTab === "Work log" && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-xl bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]/20 mb-3 border border-[#064e3b]/5">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-[13px] font-bold text-[#064e3b]/30">No work logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
