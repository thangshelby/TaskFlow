import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  ImagePlus,
  MoreHorizontal,
  Settings,
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react";
import PermissionsSettings from "../../../components/projects/settings/permissionSettings";
import { useParams } from "react-router-dom";
import { useProjectTeamById } from "@libs/hooks/apis/useTeam";
import UserAvatar from "@libs/app/components/general-components/user/userAvatar";
import { useUpdateTeam } from "@libs/hooks/apis/useTeam";
import AddProjectTeamMemberModal from "@libs/app/components/projects/modals/project/addProjectTeamMemberModal";
import LoadingFallback from "@libs/app/components/general-components/loadingFallback";
import { UI_COMMON_SIZES } from "@libs/app/components/general-components/constants/uiConfig";
import { uploadFileToCloudinary } from "@libs/utils/file";

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
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

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

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !team?.id) return;
    setIsUploadingBanner(true);
    try {
      const avatarUrl = await uploadFileToCloudinary("", file);
      if (avatarUrl) {
        await updateTeam({
          team_id: team.id,
          avatar: avatarUrl,
        });
      }
    } catch (err) {
      console.error("Failed to upload team banner:", err);
    } finally {
      setIsUploadingBanner(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

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
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          {/* Premium Banner */}
          <div 
            className="group relative flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[#064e3b]/10"
            style={{ 
              borderRadius: UI_COMMON_SIZES.medium.borderRadius,
              background: team?.avatar
                ? undefined
                : "linear-gradient(135deg, #2dd4bf 0%, #818cf8 50%, #c084fc 100%)",
            }}
          >
            {/* Show avatar image as background if available */}
            {team?.avatar && (
              <img
                src={team.avatar}
                alt="Team banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Hover overlay */}
            <div
              onClick={() => !isUploadingBanner && inputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-[#064e3b]/20 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-white/20 p-4 shadow-xl ring-1 ring-white/50">
                  {isUploadingBanner ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-white" />
                  )}
                </div>
                <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-white">
                  {isUploadingBanner ? "Uploading..." : "Update Cover"}
                </span>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-2 w-8 bg-[#064e3b] rounded-full" />
                <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/30">Team Profile</span>
              </div>
              <h1 className="font-manrope text-5xl font-black tracking-tight text-[#064e3b]">{team?.name}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <PermissionButton
                title="Add people to team"
                action={PERMISSIONS_CONFIG.team.addMember}
                handleClick={() => setIsAddPeopleOpen(true)}
              >
                <button className="flex h-12 items-center gap-2.5 rounded-xl bg-[#064e3b] px-8 font-manrope text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#064e3b]/20 transition-all hover:bg-[#064e3b]/90 hover:-translate-y-0.5 active:translate-y-0">
                  <Plus size={16} />
                  Add People
                </button>
              </PermissionButton>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#064e3b]/10 bg-white text-[#064e3b]/40 transition-all hover:bg-[#064e3b]/5 hover:text-[#064e3b] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MoreHorizontal size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-[#064e3b]/10 bg-white py-2 shadow-2xl shadow-[#064e3b]/10 animate-scale-in">
                    <button className="flex w-full items-center gap-3 px-4 py-3 font-manrope text-xs font-bold text-[#064e3b] transition-colors hover:bg-[#064e3b]/5">
                      <Settings size={14} className="opacity-40" />
                      Team settings
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-3 font-manrope text-xs font-bold text-[#064e3b] transition-colors hover:bg-[#064e3b]/5">
                      <LogOut size={14} className="opacity-40" />
                      Leave team
                    </button>
                    <div className="my-1 border-t border-[#064e3b]/5" />
                    <button className="flex w-full items-center gap-3 px-4 py-3 font-manrope text-xs font-bold text-red-600 transition-colors hover:bg-red-50">
                      <Trash2 size={14} className="opacity-40" />
                      Delete team
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar - Profile Details */}
            <div className="lg:col-span-1 space-y-8 animate-fade-in">
              {/* About Section */}
              <div 
                className="overflow-hidden bg-white px-6 py-8 ring-1 ring-[#064e3b]/5 transition-all hover:shadow-xl hover:shadow-[#064e3b]/5"
                style={{ borderRadius: UI_COMMON_SIZES.medium.borderRadius }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1.5 w-4 bg-[#064e3b]/20 rounded-full" />
                  <h3 className="font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/50">About Team</h3>
                </div>
                <p className="font-manrope text-sm leading-relaxed text-[#064e3b]">
                  {team?.description || "A cohesive group dedicated into building TaskFlow core."}
                </p>
              </div>

              {/* Members Section */}
              <div 
                className="overflow-hidden bg-white px-6 py-8 ring-1 ring-[#064e3b]/5 transition-all hover:shadow-xl hover:shadow-[#064e3b]/5"
                style={{ borderRadius: UI_COMMON_SIZES.medium.borderRadius }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 bg-[#064e3b]/20 rounded-full" />
                    <h3 className="font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/50">Roster</h3>
                  </div>
                  <span className="rounded-full bg-[#064e3b]/5 px-3 py-1 font-manrope text-[9px] font-black text-[#064e3b]">
                    {memberIds.length} ACTIVE
                  </span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {memberIds.length === 0 ? (
                    <span className="font-manrope text-xs italic text-[#064e3b]/30">No active members</span>
                  ) : (
                    memberIds.map((uid) => (
                      <div
                        key={uid}
                        className="group/member flex items-center justify-between transition-all hover:translate-x-1"
                      >
                        <UserAvatar userId={uid} size={32} isDisplayName />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Main Content - Permissions System */}
            <div className="lg:col-span-3 animate-fade-in shadow-2xl shadow-[#064e3b]/5" style={{ borderRadius: UI_COMMON_SIZES.medium.borderRadius }}>
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
