import { IColumn } from "@libs/types/project";
export interface IIssue {
  id: string;
  key: string;
  title: string;
  project_id: string;
  sprint_id?: string;
  assignee_id: string;
  column_id?: string;
  parent_id?: string;
  reporter_id?: string;
  type: IssueType;
  column: IColumn;
  priority: IssuePriority;
  summary: string;
  description: string;
  story_point: number;
  attachments: string[];
  created_at: string;
  updated_at: string;
  completed_at: string;
  due_date_from?: string;
  due_date_to?: string;
  // labels?: string[];
  team_id?: string;
  children?: IIssue[];
}
export type IIssueWithoutCoulumn = Omit<IIssue, "column">;

export type IssueStatus = "TO DO" | "IN PROGRESS" | "DONE";
export type IssuePriority = "Lowest" | "Low" | "Medium" | "High" | "Highest";
export type IssueType = "Bug" | "Task" | "Story" | "Epic";
export interface GetIssuesParams {
  project_id?: string;
  keyword?: string;
  types?: IssueType[];
  priorities?: IssuePriority[];
  status?: IssueStatus[];
  sprint_ids?: string[];
  assignee_ids?: string[];
  page?: number | string;
  limit?: number | string;
  column_ids?: string[];
  due_date_from?: string;
  due_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  is_fetch?: boolean;
  parent_ids?: string[];
  team_ids?: string[];
}

export interface CreateIssueParams {
  // Required fields from proto definition
  title?: string;
  summary: string; // Required per proto
  type: IssueType;
  column_id: string;
  priority: IssuePriority; // Use proper type
  project_id: string;

  // Optional fields
  description?: string;
  sprint_id?: string;
  assignee_id?: string;
  reporter_id?: string;
  parent_id?: string;
  story_point?: number;
  attachments?: string[];
  due_date_to?: string;
  team_id?: string;
}

export interface GetActivitiesParams {
  issue_id?: string;
  project_id: string;
  page: number;
  limit: number;
}

export interface ActivityChanges {
  field: string;
  old_value: string;
  new_value: string;
}

export interface IActivity {
  id: string;
  issue_id: string;
  action_type: string;
  user_id: string;
  user_name: string;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
  changes: ActivityChanges[];
}
