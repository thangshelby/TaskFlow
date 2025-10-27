import Button from "@libs/app/components/general-components/button";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Input,
  Badge,
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
  Bell,
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

const projects = [
  {
    id: 1,
    name: "BlueSky",
    key: "BS",
    description: "E-commerce platform redesign",
    type: "Software",
    status: "active",
    progress: 68,
    members: 8,
    issues: 24,
    dueDate: "2025-11-15",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Task Flow",
    key: "TF",
    description: "Project management tool",
    type: "Software",
    status: "active",
    progress: 45,
    members: 5,
    issues: 49,
    dueDate: "2025-12-01",
    color: "#10b981",
  },
  {
    id: 3,
    name: "Mobile App",
    key: "MA",
    description: "iOS and Android application",
    type: "Mobile",
    status: "active",
    progress: 82,
    members: 6,
    issues: 12,
    dueDate: "2025-10-20",
    color: "#a855f7",
  },
  {
    id: 4,
    name: "Dashboard Analytics",
    key: "DA",
    description: "Real-time analytics dashboard",
    type: "Software",
    status: "active",
    progress: 34,
    members: 4,
    issues: 31,
    dueDate: "2025-11-30",
    color: "#f97316",
  },
  {
    id: 5,
    name: "Marketing Site",
    key: "MS",
    description: "Company website redesign",
    type: "Web",
    status: "completed",
    progress: 100,
    members: 3,
    issues: 0,
    dueDate: "2025-09-15",
    color: "#22c55e",
  },
  {
    id: 6,
    name: "API Gateway",
    key: "AG",
    description: "Microservices API gateway",
    type: "Backend",
    status: "active",
    progress: 56,
    members: 7,
    issues: 18,
    dueDate: "2025-12-15",
    color: "#06b6d4",
  },
];

const upcomingDeadlines = [
  {
    project: "E-commerce Platform",
    dueIn: "2 days",
    color: "#10b981",
  },
  {
    project: "Mobile App Redesign",
    dueIn: "5 days",
    color: "#f97316",
  },
  {
    project: "Dashboard Analytics",
    dueIn: "1 week",
    color: "#3b82f6",
  },
];
const filterOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ProjectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [option, setOption] = useState(filterOptions[0]);

  const { projects: userProjects, isLoading: isLoadingUserProjects } =
    useUserProjects();
  const [sortBy, setSortBy] = useState("newest");

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const upcomingProjects = projects.filter((p) => {
    const dueDate = new Date(p.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilDue <= 7 && daysUntilDue > 0;
  }).length;

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
                <Button>
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "oldest"
                      ? "Oldest"
                      : "Name"}{" "}
                  <ChevronDown />
                </Button>
              </Dropdown>
            </Space>

            <Row gutter={[24, 24]}>
              {userProjects.map((project) => (
                <Col xs={24} md={12} lg={8} key={project.id}>
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    styles={{ body: { padding: 24 } }}
                    extra={
                      <Dropdown menu={{ items: projectActionItems }}>
                        <ButtonAntd
                          type="text"
                          icon={<MoreHorizontal size={16} />}
                        />
                      </Dropdown>
                    }
                  >
                    {/* Project Header */}
                    <Space style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: project.backgound_image
                            ? `url(${project.backgound_image})`
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
                          project.backgound_image ? "#10b981" : "#10b981"
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
                  {userProjects
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
                                background: project.backgound_image
                                  ? `url(${project.backgound_image})`
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
    </div>
  );
}
