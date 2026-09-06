export interface Activity {
  id: string;
  workspace_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ActivityWithProfile extends Activity {
  profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}
