export interface ITeam {
  id: string;
  name: string;
  project_id: string;
  description: string;
  permission_keys: string[];
  member_ids: string[];
  avatar: string;
  updated_at: string;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface CreateTeamParams {
  project_id: string;
  name: string;
  description?: string;
  member_ids: string[];
}

export interface UpdateTeamParams {
  team_id: string;
  name?: string;
  description?: string;
  avatar?: string;
  permission_keys?: string[];
  member_ids?: string[];
}
