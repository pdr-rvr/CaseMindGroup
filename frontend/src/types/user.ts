export interface UserInfo {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: UserInfo;
}
