export interface LoginPayload {
  email: string;
  password: string;
}

export type SignupRole = 'tourist' | 'guide' | 'provider';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: SignupRole;
}
