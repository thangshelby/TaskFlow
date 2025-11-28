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
import { usePermissions, useProject } from "@libs/hooks/apis/useProject";
import { AnimatePresence, motion } from "motion/react";
import { useRowPermission } from "@libs/app/context/permission.context";
import { useAuthStore } from "@libs/store/useAuthStore";
import { PERMISSIONS_CONFIG } from "@libs/config/permissons.config";
import { usePermission } from "@libs/hooks/common/usePermission";
import { useUserTeams } from "@libs/hooks/apis/useTeam";
import { useParams } from "react-router-dom";

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
  const [permissionStates, setPermissionStates] = useState<
    Record<string, string>
  >({});

  const { projectId } = useParams<{ projectId: string }>();
  const { project } = useProject(projectId!);
  const { user } = useAuthStore();
  const { userTeams } = useUserTeams(projectId!, user?.id!);

  // const permissionResult = usePermission({
  //   user: user!,
  //   action: PERMISSIONS_CONFIG.project.update,
  //   resource: {
  //     issue: {
  //       teams: userTeams!,
  //     },
  //   },
  // });
  useEffect(() => {
    if (rawPermissions) {
      setPERMISSIONS_DATA(normalizePermissions(rawPermissions));
    }
  }, [rawPermissions]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set();
      if (prev.has(groupId)) newSet.delete(groupId);
      else newSet.add(groupId);
      return newSet;
    });
  };

  const handlePermissionChange = (permissionId: string, value: string) => {
    const newPermissionKeys = new Set(permissionKeys);
    if (value === "granted") {
      newPermissionKeys.add(permissionId);
      setPermissionKeys(newPermissionKeys);
    } else {
      newPermissionKeys.delete(permissionId);
      setPermissionKeys(newPermissionKeys);
    }
  };

  const handleGroupPermissionChange = (groupId: string, value: string) => {
    const group = PERMISSIONS_DATA.find((g) => g.id === groupId);
    if (group) {
      const newStates = { ...permissionStates };
      group.permissions.forEach((p: { id: string }) => {
        newStates[p.id] = value;
      });
      setPermissionStates(newStates);
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
  if (!PERMISSIONS_DATA) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Team Permissions
        </h3>
      </div>

      {/* Search */}
      <div className="mb-4 rounded-lg bg-gray-50">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Permissions Accordion */}
      <div className="w-full space-y-2">
        {filteredPermissionsData.map((group) => {
          const stats = getGroupStats(group.id);
          const IconComponent = group.icon;
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div
              key={group.id}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full cursor-pointer px-6 py-4 text-left transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {group.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {stats.granted}/{stats.total} permissions granted
                    </span>
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-600 transition-all duration-300"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (stats.granted / stats.total) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 transform" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {/* Accordion Content */}
                {isExpanded && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="border-t border-gray-100 px-6 pb-4"
                  >
                    {/* Group Actions */}
                    <div className="mb-4 border-b border-gray-200 pt-4 pb-4">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() =>
                            handleGroupPermissionChange(group.id, "granted")
                          }
                          className="rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                        >
                          Allow All
                        </button>
                        <button
                          onClick={() =>
                            handleGroupPermissionChange(group.id, "denied")
                          }
                          className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                        >
                          Deny All
                        </button>
                      </div>
                    </div>

                    {/* Permissions List */}
                    <div>
                      {group.permissions.map(
                        (permission: {
                          id: string;
                          name: string;
                          description: string;
                        }) => {
                          return (
                            <div
                              key={permission.id}
                              className="flex flex-col rounded-lg border border-gray-100 bg-white p-2 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="mb-3 flex-1 sm:mb-0">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600">
                                  {permission.description}
                                </p>
                              </div>

                              <div className="flex items-center space-x-4">
                                <label className="flex cursor-pointer items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={permission.id}
                                    value="denied"
                                    checked={!permissionKeys.has(permission.id)}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        permission.id,
                                        e.target.value,
                                      )
                                    }
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    Deny
                                  </span>
                                </label>

                                <label className="flex cursor-pointer items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={permission.id}
                                    value="granted"
                                    checked={permissionKeys.has(permission.id)}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        permission.id,
                                        e.target.value,
                                      )
                                    }
                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                  />
                                  <span className="text-sm text-gray-700">
                                    Allow
                                  </span>
                                </label>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredPermissionsData.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No permissions found matching your search.
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={onSave}
          className={`inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none ${isUpdatingTeam ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
          {isUpdatingTeam && (
            <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PermissionsSettings;
