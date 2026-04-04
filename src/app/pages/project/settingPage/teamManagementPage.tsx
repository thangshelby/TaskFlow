import React, { useState, lazy, startTransition } from "react";
import { Search, Users, Plus } from "lucide-react";
import { useProjectTeams } from "@libs/hooks/apis/useTeam";
import { useNavigate, useParams } from "react-router-dom";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
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
  if (isLoading || !teams) return <div>Loading...</div>;
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTeamIconColor = (index: number) => {
    const colors = ["text-purple-600", "text-red-600", "text-emerald-600"];
    return colors[index % colors.length];
  };

  const getTeamIconBg = (index: number) => {
    const colors = ["bg-purple-50", "bg-red-50", "bg-emerald-50"];
    return colors[index % colors.length];
  };

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Tất cả các đội ngũ
          </button>
          <button
            onClick={() => setActiveTab("yours")}
            className={`cursor-pointer border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "yours"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Nhóm của bạn
          </button>
        </nav>
      </div>

      {/* Search Bar + Create Button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đội ngũ"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            startTransition(() => {
              setShowAddTeamModal(true);
            });
          }}
          className="inline-flex h-full cursor-pointer items-center gap-2 rounded-sm bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <Plus className="h-4 w-4" />
          Tạo đội
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team, index) => (
          <div
            key={team.id}
            className="relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            onClick={() =>
              navigate(`/projects/${projectId}/settings/teams/${team.id}`)
            }
          >
            {/* Team Icon */}
            <div className="flex flex-row items-center justify-between">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${getTeamIconBg(index)} mb-3`}
              >
                <Users className={`h-5 w-5 ${getTeamIconColor(index)}`} />
              </div>
              {/* Team Badge */}
              <div className="flex flex-row gap-2">
                {team.member_ids.map((memberId) => (
                  <UserAvatar
                    key={memberId}
                    userId={memberId}
                    size={20}
                    isDisplayName={false}
                  />
                ))}
              </div>
            </div>
            {/* Team Name */}
            <h3 className="mb-1 font-semibold text-gray-900">{team.name}</h3>

            {/* Member Count */}
            <p className="mb-2 text-sm text-gray-500">
              {team.member_ids.length} member
              {team.member_ids.length !== 1 ? "s" : ""}
            </p>

            {/* Description */}
            {team.description && (
              <p className="mb-3 text-sm text-gray-600">{team.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No teams found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Get started by creating a new team."}
          </p>
        </div>
      )}

      <CreateProjectTeamModal
        isOpen={showAddTeamModal}
        onClose={() => setShowAddTeamModal(false)}
      />
    </div>
  );
};

export default TeamManagementPage;
