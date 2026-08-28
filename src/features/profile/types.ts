export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferred_language?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
