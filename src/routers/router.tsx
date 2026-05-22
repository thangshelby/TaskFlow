import { Navigate, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import ChatPage from "@libs/app/pages/chat/ChatPage";
import LandingPage from "@libs/app/pages/auth/landingPage";

// Lazy load pages
const ProjectLayout = lazy(() => import("@libs/app/layouts/projectLayout"));
import DefaultLayout from "@libs/app/layouts/defaultLayout";
const BacklogPage = lazy(
    () => import("@libs/app/pages/project/backLogPage/backLogPage"),
);
const ListPage = lazy(
    () => import("@libs/app/pages/project/listPage/listPage"),
);

const ProjectPage = lazy(
    () => import("@libs/app/pages/project/projectPage/projectPage"),
);
const SettingsPage = lazy(
    () => import("@libs/app/pages/settings/settingsPage"),
);

const AdminLoginPage = lazy(
    () => import("@libs/app/pages/admin/login/AdminLoginPage"),
);
const ProjectSettingsPage = lazy(
    () => import("@libs/app/pages/project/settingPage/settingPage"),
);

const TeamManagementPage = lazy(
    () => import("@libs/app/pages/project/settingPage/teamManagementPage"),
);
const TeamDetailPage = lazy(
    () => import("@libs/app/pages/project/settingPage/teamDetail"),
);
const ProjectDetailPage = lazy(
    () => import("@libs/app/pages/project/settingPage/projectDetail"),
);

const CallbackPage = lazy(
    () => import("@libs/app/pages/auth/callbackPage/callbackPage"),
);

const AdminLayout = lazy(() => import("@libs/app/layouts/adminLayout"));
const AuthLayout = lazy(() => import("@libs/app/layouts/authLayout"));
const AdminRoute = lazy(() => import("./AdminRoute"));
const AdminCallbackPage = lazy(
    () => import("@libs/app/pages/admin/callback/AdminCallbackPage"),
);

// Admin Pages
const AdminOverviewPage = lazy(
    () => import("@libs/app/pages/admin/dashboard/AdminOverviewPage"),
);
const UsersPage = lazy(() => import("@libs/app/pages/admin/users/UsersPage"));
const ProjectsPage = lazy(
    () => import("@libs/app/pages/admin/projects/ProjectsPage"),
);
const RolesPage = lazy(() => import("@libs/app/pages/admin/roles/RolesPage"));
const AuditLogsPage = lazy(
    () => import("@libs/app/pages/admin/audit-logs/AuditLogsPage"),
);
const IssueTypesPage = lazy(
    () => import("@libs/app/pages/admin/configuration/IssueTypesPage"),
);
const { PrioritiesPage, StatusesPage, WorkflowsPage } = {
    PrioritiesPage: lazy(() =>
        import("@libs/app/pages/admin/configuration/ComingSoonPages").then((m) => ({
            default: m.PrioritiesPage,
        }))
    ),
    StatusesPage: lazy(() =>
        import("@libs/app/pages/admin/configuration/ComingSoonPages").then((m) => ({
            default: m.StatusesPage,
        }))
    ),
    WorkflowsPage: lazy(() =>
        import("@libs/app/pages/admin/configuration/ComingSoonPages").then((m) => ({
            default: m.WorkflowsPage,
        }))
    ),
};

const ProjectReport = lazy(
    () => import("@libs/app/pages/project/reportPage/reportPage"),
);
const ProjectBoard = lazy(
    () => import("@libs/app/pages/project/boardPage/boardPage"),
);
const Roadmap = lazy(
    () => import("@libs/app/pages/project/roadmapPage/roadmapPage"),
);

const VerifyPage = lazy(
    () => import("@libs/app/pages/auth/verifyPage/verifyPage"),
);
const LoginPage = lazy(
    () => import("@libs/app/pages/auth/loginPage/loginPage"),
);
const RegisterPage = lazy(
    () => import("@libs/app/pages/auth/registerPage/registerPage"),
);

const Router = (): React.ReactElement => {
    return (
        <Suspense>
            <Routes>
                {/* Public/Guest routes */}
                <Route
                    path="/"
                    element={
                        <GuestRoute>
                            <LandingPage />
                        </GuestRoute>
                    }
                    index
                />
                <Route
                    path="/auth"
                    element={
                        <GuestRoute>
                            <AuthLayout />
                        </GuestRoute>
                    }
                >
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="verify-otp" element={<VerifyPage />} />
                    <Route path="callback" element={<CallbackPage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin">
                    {/* OAuth callback lands here first (no token yet) */}
                    <Route index element={<AdminCallbackPage />} />
                    <Route path="login" element={<AdminLoginPage />} />

                    {/* Protected admin area */}
                    <Route element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            {/* Dashboard */}
                            <Route path="dashboard" element={<AdminOverviewPage />} />

                            {/* Users */}
                            <Route path="users" element={<UsersPage />} />

                            {/* Projects */}
                            <Route path="projects" element={<ProjectsPage />} />

                            {/* Roles & Permissions */}
                            <Route path="roles" element={<RolesPage />} />

                            {/* Configuration sub-routes */}
                            <Route path="configuration">
                                <Route index element={<Navigate to="issue-types" replace />} />
                                <Route path="issue-types" element={<IssueTypesPage />} />
                                <Route path="priorities" element={<PrioritiesPage />} />
                                <Route path="statuses" element={<StatusesPage />} />
                                <Route path="workflows" element={<WorkflowsPage />} />
                            </Route>

                            {/* Audit Logs */}
                            <Route path="audit-logs" element={<AuditLogsPage />} />

                            {/* Fallback: redirect /admin/dashboard → /admin/dashboard */}
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Route>
                    </Route>
                </Route>

                {/* User routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DefaultLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/projects" replace />} />
                    <Route path="projects">
                        <Route index element={<ProjectPage />} />
                        <Route path=":projectId" element={<ProjectLayout />}>
                            <Route path="board" element={<ProjectBoard />} />
                            <Route index path="summary" element={<ProjectReport />} />
                            <Route path="backlog" element={<BacklogPage />} />
                            <Route path="backlog/:selectedIssue" element={<BacklogPage />} />
                            <Route path="list" element={<ListPage />} />
                            <Route path="roadmap" element={<Roadmap />} />
                            <Route path="settings" element={<ProjectSettingsPage />}>
                                <Route path="teams" element={<TeamManagementPage />} />
                                <Route path="teams/:teamId" element={<TeamDetailPage />} />
                                <Route path="details" element={<ProjectDetailPage />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* User settings */}
                    <Route path="settings" element={<SettingsPage />} />

                    {/* Chat route */}
                    <Route path="chat" element={<ChatPage />} />

                    {/* Fallback for user routes */}
                    <Route
                        path="*"
                        element={
                            <div className="p-8 text-center text-gray-600">
                                Page not found
                            </div>
                        }
                    />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default Router;
