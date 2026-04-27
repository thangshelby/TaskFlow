import { IIssueWithoutCoulumn } from "@libs/types/issue";
import { IProjectMember } from "@libs/types/projectMember";
export interface IProject {
  id: string;
  name: string;
  description?: string;
  key: string;
  access: string;
  type: "Kanban" | "Scrum";
  owner_id: string;
  created_at: string;
  updated_at: string;
  issues_count?: number;
  members_count?: number;
  due_date_from?: string;
  due_date_to?: string;
  background_img?: string;
  project_members: IProjectMember[];
}
export interface IColumn {
  id: string;
  name: string;
  order: number;
  issues: IIssueWithoutCoulumn[];
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateColumnProjectParams {
  projectId: string;
  name: string;
}
export interface UpdateColumnProjectParams {
  name: string;
  column_id: string;
  projectId: string;
}
export interface UpdateColumnOrderParams {
  projectId: string;
  columns: {
    id: string;
    order: number;
  }[];
}

export interface ListProjectColumnsParams {
  project_id: string;
  assignee_ids?: string[];
  column_ids?: string[];
  sprint_ids?: string[];
  types?: string[];
  priorities?: string[];
  keyword?: string;
  due_date_from?: string;
  due_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  active_sprint_only?: boolean;
}

export interface StatusCount {
  name: string;
  count: number;
}

export interface PriorityCount {
  priority: string;
  count: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface UserStats {
  by_status: StatusCount[];
  by_priority: PriorityCount[];
  by_type: TypeCount[];
  new_issues_count: number;
  recently_updated_count: number;
}

export interface ProjectSummaryContributor {
  user_id: string;
  display_name: string;
  avatar: string;
  resolved_count: number;
  contribution_percent: number;
}

export interface ProjectSummaryTimelinePoint {
  date: string;
  done_issues: number;
  remaining_scope: number;
  added_scope: number;
}

export interface ProjectSummary {
  by_status: StatusCount[];
  by_priority: PriorityCount[];
  by_type: TypeCount[];
  top_contributors: ProjectSummaryContributor[];
  timeline: ProjectSummaryTimelinePoint[];
  total_issues: number;
  done_issues: number;
  new_issues_count: number;
  recently_updated_count: number;
}

export interface GetProjectSummaryParams {
  project_id: string;
  sprint_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface IPermission {
  id: string;
  key: string;
  resource: string;
  label: string;
  description: string;
}
