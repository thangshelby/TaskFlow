import Button from "@libs/app/components/general-components/button";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Input,
  Dropdown,
  Progress,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Typography,
  Button as ButtonAntd,
} from "antd";
import type { MenuProps } from "antd";
import {
  Search,
  Plus,
  Settings,
  User,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Folder,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useUserProjects } from "@libs/hooks/apis/useProject";
const { Title, Text, Paragraph } = Typography;
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "@libs/app/components/projects/modals/project/createProjectModal";
export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { projects } = useUserProjects();
  const [sortBy, setSortBy] = useState("newest");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const activeProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() < new Date().getTime() &&
      new Date(p.due_date_to).getTime() > new Date().getTime(),
  ).length;
  const completedProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() > new Date().getTime() &&
      new Date(p.due_date_to).getTime() < new Date().getTime(),
  ).length;
  const upcomingProjects = projects.filter(
    (p) =>
      p.due_date_from &&
      p.due_date_to &&
      new Date(p.due_date_from).getTime() > new Date().getTime() &&
      new Date(p.due_date_to).getTime() > new Date().getTime(),
  ).length;

  const sortMenuItems: MenuProps["items"] = [
    { key: "newest", label: "Newest" },
    { key: "oldest", label: "Oldest" },
    { key: "name", label: "Name" },
  ];

  const projectActionItems: MenuProps["items"] = [
    { key: "view", label: "View Details" },
    { key: "edit", label: "Edit Project" },
    { key: "archive", label: "Archive" },
    { key: "delete", label: "Delete", danger: true },
  ];
  return (
    <div className="">
      <Helmet>
        <title>Projects - Task Flow</title>
      </Helmet>

      <div className="flex h-full flex-col">
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <main style={{ flex: 1, overflow: "auto", padding: 32 }}>
            {/* Page Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Projects
                </Title>
                <Text type="secondary">
                  Manage and track all your projects in one place
                </Text>
              </div>
            </div>

            {/* Search and Filter */}
            <Space style={{ marginBottom: 24 }} size="middle">
              <Input
                placeholder="Search for project..."
                prefix={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300, background: "#fafafa" }}
              />
              <Dropdown
                menu={{
                  items: sortMenuItems,
                  onClick: ({ key }) => setSortBy(key),
                }}
              >
                <div>
                  <Button>
                    {sortBy === "newest"
                      ? "Newest"
                      : sortBy === "oldest"
                        ? "Oldest"
                        : "Name"}{" "}
                    <ChevronDown size={16} />
                  </Button>
                </div>
              </Dropdown>
            </Space>

            <Row gutter={[24, 24]}>
              {projects.map((project) => (
                <Col
                  onClick={() => navigate(`/projects/${project.id}/summary`)}
                  xs={24}
                  md={12}
                  lg={8}
                  key={project.id}
                >
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    styles={{ body: { padding: 24 } }}
                    extra={
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold">
                            {project.due_date_from
                              ? new Date(
                                  project.due_date_from,
                                ).toLocaleDateString()
                              : "No due date"}
                          </span>
                          -
                          <span className="text-sm font-bold">
                            {project.due_date_to
                              ? new Date(
                                  project.due_date_to,
                                ).toLocaleDateString()
                              : "No due date"}
                          </span>
                        </div>

                        <Dropdown menu={{ items: projectActionItems }}>
                          <ButtonAntd
                            onClick={(e) => e.stopPropagation()}
                            type="text"
                            icon={<MoreHorizontal size={16} />}
                          />
                        </Dropdown>
                      </div>
                    }
                  >
                    {/* Project Header */}
                    <Space style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: project.background_img
                            ? `url(${project.background_img})`
                            : "#10b981",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        {project.key}
                      </div>
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {project.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {project.type}
                        </Text>
                      </div>
                    </Space>

                    {/* Description */}
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      style={{ marginBottom: 16, minHeight: 40 }}
                    >
                      {project.description}
                    </Paragraph>

                    {/* Progress */}
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Progress
                        </Text>
                        <Text strong style={{ fontSize: 12 }}>
                          {project.issues_count}%
                        </Text>
                      </div>
                      <Progress
                        percent={project.issues_count}
                        strokeColor={
                          project.background_img ? "#10b981" : "#10b981"
                        }
                        showInfo={false}
                      />
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 16,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <Space size="large">
                        <Space size={4}>
                          <Folder size={14} style={{ color: "#8c8c8c" }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {project.issues_count} issues
                          </Text>
                        </Space>
                        <Space size={4}>
                          <User size={14} style={{ color: "#8c8c8c" }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {project.members_count}
                          </Text>
                        </Space>
                      </Space>
                      <Tag
                        icon={
                          project.type === "Kanban" ? (
                            <Clock size={12} />
                          ) : (
                            <CheckCircle size={12} />
                          )
                        }
                        color={
                          project.type === "Kanban" ? "processing" : "success"
                        }
                      >
                        {project.type}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </main>

          <aside
            style={{
              width: 320,
              borderLeft: "1px solid #f0f0f0",
              background: "#fff",
              overflow: "auto",
              padding: 24,
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Project Statistics */}
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <TrendingUp size={20} style={{ color: "#10b981" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Project Statistics
                  </Title>
                </Space>

                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <Statistic
                        title="Total Projects"
                        value={projects.length}
                        valueStyle={{ fontSize: 24 }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <Statistic
                        title="Active"
                        value={activeProjects}
                        valueStyle={{ fontSize: 24, color: "#10b981" }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#f0fdf9",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <Statistic
                        title="Completed"
                        value={completedProjects}
                        valueStyle={{ fontSize: 24, color: "#22c55e" }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                      }}
                    >
                      <Statistic
                        title="Upcoming"
                        value={upcomingProjects}
                        valueStyle={{ fontSize: 24, color: "#f97316" }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <Calendar size={20} style={{ color: "#10b981" }} />
                  <Title level={5} style={{ margin: 0 }}>
                    Recent Projects
                  </Title>
                </Space>

                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {projects
                    .sort(
                      (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime(),
                    )
                    .map((project, index) => (
                      <Card key={index} size="small" hoverable>
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Space>
                            <div
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: project.background_img
                                  ? `url(${project.background_img})`
                                  : "#10b981",
                              }}
                            />
                            <div>
                              <Text strong style={{ fontSize: 14 }}>
                                {project.name}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {new Date(
                                  project.updated_at,
                                ).toLocaleDateString()}
                              </Text>
                            </div>
                          </Space>
                          <AlertTriangle
                            size={16}
                            style={{ color: "#f97316" }}
                          />
                        </Space>
                      </Card>
                    ))}
                </Space>
              </div>

              {/* Quick Actions */}
              <div>
                <Title level={5} style={{ marginBottom: 16 }}>
                  Quick Actions
                </Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <ButtonAntd
                    block
                    icon={<Plus size={16} />}
                    style={{ textAlign: "left" }}
                    onClick={() => {
                      setIsCreateProjectModalOpen(true);
                    }}
                  >
                    Create New Project
                  </ButtonAntd>
                  <ButtonAntd
                    block
                    icon={<Folder size={16} />}
                    style={{ textAlign: "left" }}
                  >
                    View Archived
                  </ButtonAntd>
                  <ButtonAntd
                    block
                    icon={<Settings size={16} />}
                    style={{ textAlign: "left" }}
                  >
                    Project Settings
                  </ButtonAntd>
                </Space>
              </div>
            </Space>
          </aside>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
    </div>
  );
}
