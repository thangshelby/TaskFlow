import { useState, lazy, useTransition } from "react";
import { FaGear } from "react-icons/fa6";
import { useAuth } from "@libs/hooks/apis/useAuth";
import Image from "../image";
import logo from "@libs/assets/taskflow.png";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@libs/app/components/general-components/user/search";

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

// 👇 Lazy load ProjectDropdown (fetch sẽ chỉ chạy khi mount)
const ProjectDropdown = lazy(() => import("../dropdown/projectDropdown"));

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
    <div>
      <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        {/* Left section */}
        <div className="flex w-1/4 items-center space-x-4">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center"
            onClick={() => navigate("/")}
          >
            <Image src={logo} className="h-[17px] w-[100px]" />
          </div>

          {/* Project Dropdown - Lazy fetch khi click */}
          {user && <ProjectDropdown />}
        </div>

        {/*Middle section */}
        <div className="flex w-1/2 items-center justify-center space-x-4">
          <div className="relative w-[60%]">
            <SearchHeader />
          </div>
          {user && (
            <Button className="" onClick={handleOpenCreateIssue}>
              <span className="text-base font-semibold">Create Issue</span>
            </Button>
          )}
        </div>

        {/* Right section */}
        {user && (
          <div className="flex w-1/4 items-center justify-end space-x-2">
            <NotificationsPopover />
            <ProjectInvitationsPopover userId={user?.id || ""} />
            <div
              className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => navigate("/settings")}
            >
              <FaGear />
            </div>

            {/* User Menu */}
            <div className="relative">
              <div
                className="flex items-center space-x-2 text-red-500"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <p className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.first_name?.[0]}
                  </span>
                </p>
              </div>
              {isUserDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-medium">{`${user?.first_name} ${user?.last_name}`}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Profile
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Settings
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          setIsUserDropdownOpen(false);
                          await logout();
                          navigate("/login", { replace: true });
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!user && (
          <div className="flex min-w-1/4 items-center justify-center">
            <Button
              className="w-[100px]"
              onClick={() => navigate("/login")}
              variant="outline"
            >
              <span className="text-base font-semibold">Login</span>
            </Button>
          </div>
        )}
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
