import { Settings, Users, Shield, Workflow } from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
const ProjectSettings = () => {
  const settingsMenuItems = [
    { id: "details", name: "General", icon: Settings, enabled: true },
    { id: "teams", name: "Teams", icon: Users, enabled: true },
    { id: "permissions", name: "Permissions", icon: Shield, enabled: false },
    { id: "workflows", name: "Workflows", icon: Workflow, enabled: false },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();

  // Redirect base settings route to the default tab (details)
  useEffect(() => {
    if (
      projectId &&
      location.pathname.endsWith(`/projects/${projectId}/settings`)
    ) {
      navigate(`/projects/${projectId}/settings/details`, { replace: true });
    }
  }, [location.pathname, navigate, projectId]);
  return (
    <div className="h-full w-full">
      {/* Main Content */}
      <div className="mx-auto flex flex-col gap-8">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Project Settings
            </h2>
            <p className="text-gray-600">
              Manage your TaskFlow project configuration and permissions
            </p>
          </div>

          {/* Top navigation bar (Jira-like) */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {settingsMenuItems.map((item) => {
                const Icon = item.icon;
                const to = `/projects/${projectId}/settings/${item.id}`;
                if (item.enabled) {
                  return (
                    <NavLink
                      key={item.id}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                          ? "border-teal-600 text-teal-700"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </NavLink>
                  );
                }
                return (
                  <span
                    key={item.id}
                    title="Coming soon"
                    className="flex cursor-not-allowed items-center gap-2 border-b-2 border-transparent px-1 py-3 text-sm font-medium whitespace-nowrap text-gray-400"
                    aria-disabled
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectSettings;
