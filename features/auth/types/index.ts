export interface AuthUser {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}
