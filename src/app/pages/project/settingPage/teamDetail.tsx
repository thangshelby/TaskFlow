import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  ImagePlus,
  MoreHorizontal,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react";
import PermissionsSettings from "../../../components/projects/settings/permissionSettings";
import { useParams } from "react-router-dom";
import { useProjectTeamById } from "@libs/hooks/apis/useTeam";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { useUpdateTeam } from "@libs/hooks/apis/useTeam";
import AddProjectTeamMemberModal from "@libs/app/components/projects/modals/project/addProjectTeamMemberModal";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";

import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import PermissionButton from "@libs/app/components/general-components/pemissionButton";

const TeamDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { teamId } = useParams<{ teamId: string }>();
  const { team, isLoadingTeam } = useProjectTeamById(
    projectId || "",
    teamId || "",
  );
  const { updateTeam, isLoading: isUpdatingTeam } = useUpdateTeam(
    projectId || "",
  );
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);

  const [newPermissionKeys, setNewPermissionKeys] = useState<Set<string>>(
    new Set(team?.permission_keys || []),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setNewPermissionKeys(new Set(team?.permission_keys || []));
  }, [team]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
  const memberIds = useMemo(() => team?.member_ids || [], [team]);

  const handleUpdateTeam = async () => {
    if (!team?.id) throw new Error("Missing team id");
    return updateTeam({
      team_id: team.id,
      permission_keys: Array.from(newPermissionKeys),
    });
  };

  if (isLoadingTeam || !team) return <LoadingFallback />;

  return (
    <>
      <div className="min-h-screen px-8">
        <div className="mx-auto flex w-full flex-col gap-6">
          {/* Green Banner */}
          <div className="group relative flex h-52 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-teal-400 via-blue-200 to-indigo-100">
            <div
              onClick={() => {
                inputRef.current?.click();
              }}
              className="absolute top-0 right-0 hidden h-full w-full items-center justify-center bg-black/30 group-hover:flex"
            >
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white px-3 py-1 text-sm text-white shadow-sm"
              >
                <ImagePlus className="h-4 w-4" />
                Add cover image
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  console.log(e.target.files);
                }}
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team?.name}</h1>
            </div>
            <div className="flex flex-row items-center gap-2">
              <PermissionButton
                title="Add people to team"
                action={PERMISSIONS_CONFIG.team.addMember}
                handleClick={() => {
                  setIsAddPeopleOpen(true);
                }}
              >
                <div className="text-md inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  Add people
                </div>
              </PermissionButton>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle team settings
                        console.log("Team settings clicked");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      Team settings
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle leave team
                        console.log("Leave team clicked");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Leave team
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle delete team
                        console.log("Delete team clicked");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete team
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Sidebar - Team Profile */}
            <div className="space-y-6 lg:col-span-1">
              {/* Team Profile Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      About
                    </h3>
                    <p className="text-sm text-gray-600">
                      {team?.description || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Members
                    </h3>
                    <div className="flex flex-col gap-2">
                      {memberIds.length === 0 && (
                        <span className="text-sm text-gray-500">
                          No members
                        </span>
                      )}
                      {memberIds.map((uid) => (
                        <div
                          key={uid}
                          className="flex items-center justify-between rounded-md border border-gray-100 px-2 py-1.5 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              userId={uid}
                              size={28}
                              isDisplayName={true}
                            />
                          </div>
                        </div>
                      ))}
                      <span className="mt-1 text-sm text-gray-600">
                        {memberIds.length} members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Team Permissions */}
            <div className="lg:col-span-2">
              <PermissionsSettings
                permissionKeys={newPermissionKeys}
                setPermissionKeys={setNewPermissionKeys}
                onSave={handleUpdateTeam}
                isUpdatingTeam={isUpdatingTeam}
              />
            </div>
          </div>
        </div>
      </div>

      <AddProjectTeamMemberModal
        isOpen={isAddPeopleOpen}
        onClose={() => setIsAddPeopleOpen(false)}
        projectId={projectId || ""}
        teamId={teamId || ""}
        excludeUserIds={memberIds}
      />
    </>
  );
};

export default TeamDetailPage;
