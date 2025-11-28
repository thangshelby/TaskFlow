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

export interface IPermission {
  id: string;
  key: string;
  resource: string;
  label: string;
  description: string;
}
