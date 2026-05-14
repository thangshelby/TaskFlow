import React, { useState, lazy, startTransition, Suspense } from "react";
import { Search, Users, Plus } from "lucide-react";
import { useProjectTeams } from "@libs/hooks/apis/useTeam";
import { useNavigate, useParams } from "react-router-dom";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";
import { UI_COMMON_SIZES } from "@libs/app/components/general-components/constants/uiConfig";
const CreateProjectTeamModal = lazy(
  () =>
    import(
      "@libs/app/components/projects/modals/project/createProjectTeamModal"
    ),
);

const TeamManagementPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "yours">("yours");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  
  const { teams, isLoading } = useProjectTeams(projectId || "");

  if (isLoading || !teams) return <LoadingFallback />;

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTeamIconStyle = (index: number) => {
    const sets = [
      { bg: "bg-emerald-50", text: "text-emerald-600" },
      { bg: "bg-blue-50", text: "text-blue-600" },
      { bg: "bg-purple-50", text: "text-purple-600" },
      { bg: "bg-amber-50", text: "text-amber-600" },
    ];
    return sets[index % sets.length];
  };

  return (
    <div className="space-y-10">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation Tabs (Sub-navigation) */}
        <div className="inline-flex rounded-xl bg-[#064e3b]/5 p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer rounded-lg px-6 py-2 font-manrope text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "all"
                ? "bg-white text-[#064e3b] shadow-sm"
                : "text-[#064e3b]/40 hover:text-[#064e3b]/70"
            }`}
          >
            All Teams
          </button>
          <button
            onClick={() => setActiveTab("yours")}
            className={`cursor-pointer rounded-lg px-6 py-2 font-manrope text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "yours"
                ? "bg-white text-[#064e3b] shadow-sm"
                : "text-[#064e3b]/40 hover:text-[#064e3b]/70"
            }`}
          >
            Your Teams
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="group relative flex-1 sm:w-80">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#064e3b]/30 transition-colors group-focus-within:text-[#064e3b]" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#064e3b]/10 bg-white pl-11 pr-4 font-manrope text-sm text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5 placeholder:text-[#064e3b]/30"
            />
          </div>
          <button
            type="button"
            onClick={() => startTransition(() => setShowAddTeamModal(true))}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#064e3b] px-6 font-manrope text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#064e3b]/20 transition-all hover:bg-[#064e3b]/90 hover:-translate-y-0.5"
          >
            <Plus size={14} />
            Create Team
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.map((team, index) => {
          const style = getTeamIconStyle(index);
          return (
            <div
              key={team.id}
              className="group relative flex flex-col overflow-hidden bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#064e3b]/5"
              style={{ borderRadius: UI_COMMON_SIZES.medium.borderRadius, border: "1px solid rgba(6, 78, 59, 0.05)" }}
              onClick={() => navigate(`/projects/${projectId}/settings/teams/${team.id}`)}
            >
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  {/* Icon Block */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.bg} ${style.text}`}>
                    <Users size={24} />
                  </div>
                  
                  {/* Avatar Stack */}
                  <div className="flex -space-x-3">
                    {team.member_ids.slice(0, 4).map((memberId, idx) => (
                      <div 
                        key={memberId} 
                        className="ring-4 ring-white rounded-full overflow-hidden"
                        style={{ zIndex: 10 - idx }}
                      >
                        <UserAvatar userId={memberId} size={28} isDisplayName={false} />
                      </div>
                    ))}
                    {team.member_ids.length > 4 && (
                      <div className="z-0 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#064e3b]/5 font-manrope text-[10px] font-black text-[#064e3b] ring-4 ring-white">
                        +{team.member_ids.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-manrope text-lg font-black text-[#064e3b] transition-colors group-hover:text-emerald-700">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-2 font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {team.member_ids.length} Member{team.member_ids.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {team.description && (
                  <p className="mt-4 line-clamp-2 font-manrope text-xs leading-relaxed text-[#064e3b]/60">
                    {team.description}
                  </p>
                )}
              </div>
              
              {/* Subtle hover indicator */}
              <div className="h-1 w-full scale-x-0 bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#064e3b]/5 text-[#064e3b]/20">
            <Users size={40} />
          </div>
          <h3 className="font-manrope text-lg font-black text-[#064e3b]">No Teams Found</h3>
          <p className="mt-2 font-manrope text-sm text-[#064e3b]/40">
            {searchQuery
              ? "We couldn't find any teams matching your search."
              : "Kickstart collaboration by creating your first project team."}
          </p>
        </div>
      )}

      <Suspense fallback={null}>
        <CreateProjectTeamModal
          isOpen={showAddTeamModal}
          onClose={() => setShowAddTeamModal(false)}
        />
      </Suspense>
    </div>
  );
};

export default TeamManagementPage;
