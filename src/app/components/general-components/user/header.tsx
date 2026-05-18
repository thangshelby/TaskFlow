import { useState, lazy, useTransition } from "react";
import {
  Settings,
  Plus
} from "lucide-react";
import { useAuth } from "@libs/hooks/apis/useAuth";
import { useNavigate, Link } from "react-router-dom";
import SearchHeader from "./search";

// Lazy load Component
const NotificationsPopover = lazy(
  () => import("../../notifications/notificationsPopover"),
);
const ProjectInvitationsPopover = lazy(
  () => import("../../projects/projectInvitationsPopover"),
);
const CreateIssueModal = lazy(
  () => import("../../projects/modals/issue/createIssueModal"),
);

export const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const [_, startTransition] = useTransition();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenCreateIssue = () => {
    startTransition(() => {
      setIsCreateIssueModalOpen(true);
    });
  };

  const handleCloseIssueModal = () => {
    setIsCreateIssueModalOpen(false);
  };

  return (
    <div className="w-full">
      <header className="sticky top-0 z-40 w-full bg-[#f9f9f8]/80 backdrop-blur-xl shadow-sm border-b border-[#e8e8e7]">
        <div className="flex justify-between items-center h-16 px-8 w-full">
          {/* Left section: Logo */}
          <div className="shrink-0">
            <Link
              to="/"
              className="text-3xl font-bold tracking-tighter text-[#064e3b] no-underline"
            >
              Taskflow
            </Link>
          </div>

          {/* Center section: Search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="relative hidden lg:block w-full max-w-3xl">
              <SearchHeader />
            </div>
          </div>

          {/* Right section: Actions & Profile */}
          <div className="flex items-center gap-6 shrink-0">


            {/* Actions */}
            <div className="flex items-center gap-2">
              {user && (
                <>
                  <div className="relative">
                    <NotificationsPopover />
                  </div>
                  <div className="relative">
                    <ProjectInvitationsPopover userId={user.id} />
                  </div>
                  <button
                    onClick={() => navigate("/settings")}
                    aria-label="Settings"
                    className="p-2.5 text-[#404944] hover:text-[#064e3b] transition-colors rounded-full hover:bg-[#eeeeed]"
                  >
                    <Settings size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-[#e8e8e7] mx-1"></div>

            {user ? (
              <div className="flex items-center gap-5">
                <button
                  onClick={handleOpenCreateIssue}
                  className="bg-[#064e3b] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create New
                </button>

                {/* User Profile Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center active:scale-95 transition-transform"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-[#e8e8e7] object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#064e3b] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-48 rounded-xl bg-white shadow-xl border border-[#e8e8e7] overflow-hidden">
                      <div className="px-4 py-3 bg-[#f9f9f8]">
                        <p className="text-sm font-semibold text-[#064e3b]">{`${user.first_name} ${user.last_name}`}</p>
                        <p className="text-[10px] text-[#404944] font-medium opacity-70 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => { setIsUserDropdownOpen(false); navigate("/settings/profile"); }}
                          className="flex items-center w-full px-3 py-2 text-xs font-medium text-[#404944] hover:bg-[#f3f4f3] rounded-lg transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => { setIsUserDropdownOpen(false); navigate("/settings"); }}
                          className="flex items-center w-full px-3 py-2 text-xs font-medium text-[#404944] hover:bg-[#f3f4f3] rounded-lg transition-colors"
                        >
                          Workspace Settings
                        </button>
                        <div className="h-px bg-[#e8e8e7] my-1"></div>
                        <button
                          onClick={async () => {
                            setIsUserDropdownOpen(false);
                            await logout();
                            navigate("/auth/login", { replace: true });
                          }}
                          className="flex items-center w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="text-xs font-bold text-[#064e3b] uppercase tracking-widest hover:underline"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {isCreateIssueModalOpen && (
        <CreateIssueModal
          isOpen={isCreateIssueModalOpen}
          onClose={handleCloseIssueModal}
        />
      )}
    </div>
  );
};

export default Header;

