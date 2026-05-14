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

  useEffect(() => {
    if (
      projectId &&
      location.pathname.endsWith(`/projects/${projectId}/settings`)
    ) {
      navigate(`/projects/${projectId}/settings/details`, { replace: true });
    }
  }, [location.pathname, navigate, projectId]);

  return (
    <div className="h-full w-full bg-[#fcfcfb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col p-8">
        <div className="mb-8">
          <h1 className="font-manrope text-4xl font-black tracking-tight text-[#064e3b]">
            Project Settings
          </h1>
          <p className="mt-2 font-manrope text-sm font-medium text-[#064e3b]/60 uppercase tracking-widest leading-loose">
            Manage your project's identity, team, and operational workflows
          </p>
        </div>

        {/* Premium Navigation Tabs */}
        <div className="mb-6 border-b border-[#064e3b]/10">
          <nav className="-mb-px flex space-x-10">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              const to = `/projects/${projectId}/settings/${item.id}`;
              
              if (item.enabled) {
                return (
                  <NavLink
                    key={item.id}
                    to={to}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 border-b-2 py-4 px-1 font-manrope text-[11px] font-black uppercase tracking-widest transition-all ${
                        isActive
                          ? "border-[#064e3b] text-[#064e3b]"
                          : "border-transparent text-[#064e3b]/40 hover:border-[#064e3b]/20 hover:text-[#064e3b]/70"
                      }`
                    }
                  >
                    <Icon size={14} className="transition-transform group-hover:scale-110" />
                    {item.name}
                  </NavLink>
                );
              }
              
              return (
                <div
                  key={item.id}
                  title="Coming soon"
                  className="flex cursor-not-allowed items-center gap-2.5 border-b-2 border-transparent py-4 px-1 font-manrope text-[11px] font-black uppercase tracking-widest text-[#064e3b]/15"
                >
                  <Icon size={14} />
                  {item.name}
                  <span className="ml-1 rounded-full bg-[#064e3b]/5 px-2 py-0.5 text-[8px] opacity-100">SOON</span>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
