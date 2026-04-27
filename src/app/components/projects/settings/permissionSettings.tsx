import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Save,
  Shield,
  Users,
  Key,
  Folder,
  Bug,
  Calendar,
  File,
  Settings,
  Server,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { usePermissions } from "@libs/hooks/apis/useProject";
import { AnimatePresence, motion } from "motion/react";
import { UI_COMMON_SIZES } from "@libs/app/components/general-components/constants/uiConfig";

// Map resource -> display info
const RESOURCE_CONFIG: Record<string, { name: string; icon: any }> = {
  user: { name: "User Permissions", icon: Users },
  auth: { name: "Auth Permissions", icon: Key },
  role: { name: "Role Permissions", icon: Shield },
  permission: { name: "Permission Settings", icon: Shield },
  project: { name: "Project Permissions", icon: Folder },
  team: { name: "Team Permissions", icon: Users },
  issue: { name: "Issue Permissions", icon: Bug },
  sprint: { name: "Sprint Permissions", icon: Calendar },
  file: { name: "File Permissions", icon: File },
  system: { name: "System Permissions", icon: Server },
};

const normalizePermissions = (rawPermissions: any[]) => {
  const groups: Record<
    string,
    { id: string; name: string; icon: any; permissions: any[] }
  > = {};

  rawPermissions.forEach((p) => {
    const resourceInfo = RESOURCE_CONFIG[p.resource] || {
      name: p.resource,
      icon: Settings,
    };

    if (!groups[p.resource]) {
      groups[p.resource] = {
        id: p.resource,
        name: resourceInfo.name,
        icon: resourceInfo.icon,
        permissions: [],
      };
    }

    groups[p.resource].permissions.push({
      id: p.key,
      name: p.label,
      description: `${p.description}`,
    });
  });

  return Object.values(groups);
};

const PermissionsSettings = ({
  permissionKeys,
  setPermissionKeys,
  onSave,
  isUpdatingTeam,
}: {
  permissionKeys: Set<string>;
  setPermissionKeys: (permissionKeys: Set<string>) => void;
  onSave: () => void;
  isUpdatingTeam?: boolean;
}) => {
  const { permissions: rawPermissions } = usePermissions();
  const [PERMISSIONS_DATA, setPERMISSIONS_DATA] = useState<any[]>([]);

  useEffect(() => {
    if (rawPermissions) {
      setPERMISSIONS_DATA(normalizePermissions(rawPermissions));
    }
  }, [rawPermissions]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (prev.has(groupId)) newSet.delete(groupId);
      else newSet.add(groupId);
      return newSet;
    });
  };

  const handlePermissionChange = (permissionId: string, value: string) => {
    const newPermissionKeys = new Set(permissionKeys);
    if (value === "granted") {
      newPermissionKeys.add(permissionId);
    } else {
      newPermissionKeys.delete(permissionId);
    }
    setPermissionKeys(newPermissionKeys);
  };

  const handleGroupPermissionChange = (groupId: string, value: string) => {
    const group = PERMISSIONS_DATA.find((g) => g.id === groupId);
    if (group) {
      const newPermissionKeys = new Set(permissionKeys);
      group.permissions.forEach((p: { id: string }) => {
        if (value === "granted") newPermissionKeys.add(p.id);
        else newPermissionKeys.delete(p.id);
      });
      setPermissionKeys(newPermissionKeys);
    }
  };

  const filteredPermissionsData = useMemo(() => {
    if (!searchQuery) return PERMISSIONS_DATA;

    return PERMISSIONS_DATA.map((group) => ({
      ...group,
      permissions: group.permissions.filter(
        (p: { name: string; description: string }) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    })).filter((group) => group.permissions.length > 0);
  }, [searchQuery, PERMISSIONS_DATA]);

  const getGroupStats = (groupId: string) => {
    const group = PERMISSIONS_DATA.find((g) => g.id === groupId);
    if (!group) return { total: 0, granted: 0 };

    const total = group.permissions.length;
    const granted = group.permissions.filter((perm: { id: string }) =>
      permissionKeys.has(perm.id),
    ).length;
    return { total, granted };
  };

  if (!PERMISSIONS_DATA.length) return null;

  return (
    <div className="bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-8 rounded-full bg-[#064e3b]" />
          <h3 className="font-manrope text-2xl font-black text-[#064e3b]">
            Team Permissions
          </h3>
        </div>
        
        <div className="group relative w-72">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#064e3b]/30 transition-colors group-focus-within:text-[#064e3b]" />
          <input
            type="text"
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-[#064e3b]/10 bg-[#fcfcfb] pl-11 pr-4 font-manrope text-sm text-[#064e3b] transition-all focus:border-[#064e3b]/30 focus:outline-none focus:ring-4 focus:ring-[#064e3b]/5 placeholder:text-[#064e3b]/30"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredPermissionsData.map((group) => {
          const stats = getGroupStats(group.id);
          const IconComponent = group.icon;
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div
              key={group.id}
              className={`overflow-hidden border transition-all duration-300 ${
                isExpanded ? "border-[#064e3b]/20 bg-white shadow-xl shadow-[#064e3b]/5" : "border-[#064e3b]/5 bg-[#fcfcfb]/50"
              }`}
              style={{ borderRadius: UI_COMMON_SIZES.medium.borderRadius }}
            >
              <button
                onClick={() => toggleGroup(group.id)}
                className="group w-full cursor-pointer p-6 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${isExpanded ? "bg-[#064e3b] text-white" : "bg-[#064e3b]/5 text-[#064e3b]"}`}>
                      <IconComponent size={20} />
                    </div>
                    <span className="font-manrope text-sm font-black text-[#064e3b] uppercase tracking-wider">
                      {group.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-manrope text-[10px] font-black uppercase tracking-widest text-[#064e3b]/40">
                         {stats.granted} / {stats.total} GRANTED
                      </span>
                      <div className="h-1.5 w-32 rounded-full bg-[#064e3b]/5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(stats.granted / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-[#064e3b]/30 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#064e3b]" : ""}`}
                    />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#064e3b]/5 p-6">
                      <div className="mb-8 flex items-center gap-3">
                        <button
                          onClick={() => handleGroupPermissionChange(group.id, "granted")}
                          className="rounded-lg bg-emerald-50 px-4 py-2 font-manrope text-[10px] font-black uppercase tracking-widest text-emerald-700 transition-all hover:bg-emerald-100"
                        >
                          Allow All
                        </button>
                        <button
                          onClick={() => handleGroupPermissionChange(group.id, "denied")}
                          className="rounded-lg bg-red-50 px-4 py-2 font-manrope text-[10px] font-black uppercase tracking-widest text-red-700 transition-all hover:bg-red-100"
                        >
                          Deny All
                        </button>
                      </div>

                      <div className="space-y-4">
                        {group.permissions.map((permission: any) => (
                          <div
                            key={permission.id}
                            className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#064e3b]/2 last:border-0"
                          >
                            <div className="max-w-md">
                              <h4 className="font-manrope text-sm font-black text-[#064e3b]">
                                {permission.name}
                              </h4>
                              <p className="mt-1 font-manrope text-xs leading-relaxed text-[#064e3b]/50">
                                {permission.description}
                              </p>
                            </div>

                            <div className="inline-flex rounded-xl bg-[#064e3b]/5 p-1">
                              <button
                                onClick={() => handlePermissionChange(permission.id, "denied")}
                                className={`px-4 py-1.5 font-manrope text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                                  !permissionKeys.has(permission.id)
                                    ? "bg-white text-red-600 shadow-sm"
                                    : "text-[#064e3b]/30 hover:text-[#064e3b]/50"
                                }`}
                              >
                                Deny
                              </button>
                              <button
                                onClick={() => handlePermissionChange(permission.id, "granted")}
                                className={`px-4 py-1.5 font-manrope text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                                  permissionKeys.has(permission.id)
                                    ? "bg-[#064e3b] text-white shadow-lg"
                                    : "text-[#064e3b]/30 hover:text-[#064e3b]/50"
                                }`}
                              >
                                Allow
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-end border-t border-[#064e3b]/5 pt-8">
        <button
          onClick={onSave}
          disabled={isUpdatingTeam}
          className={`flex h-12 items-center gap-2.5 rounded-xl px-12 font-manrope text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${
            isUpdatingTeam
              ? "bg-[#064e3b]/30 cursor-not-allowed"
              : "bg-[#064e3b] shadow-[#064e3b]/20 hover:bg-[#064e3b]/90 hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isUpdatingTeam ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isUpdatingTeam ? "Updating..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default PermissionsSettings;
