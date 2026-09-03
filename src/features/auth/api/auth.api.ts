import { apiClient } from '../../../shared/api/client';
import type { TokenResponse, UserPublic } from '../../../shared/api/types';
import type { LoginPayload, RegisterPayload } from '../types';

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', payload);
  return data;
}

export async function loginWithGoogle(idToken: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/google', { id_token: idToken });
  return data;
}

export async function register(payload: RegisterPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/register', payload);
  return data;
}

export async function fetchMe(): Promise<UserPublic> {
  const { data } = await apiClient.get<UserPublic>('/auth/me');
  return data;
}

export interface UserVerification {
  full_name: string;
  role: string;
  is_verified: boolean;
  avatar_url?: string | null;
  member_since: string;
}

export async function fetchVerification(cardToken: string): Promise<UserVerification> {
  const { data } = await apiClient.get<UserVerification>(`/auth/verify/${cardToken}`);
  return data;
}

export async function fetchCardToken(): Promise<{ card_token: string }> {
  const { data } = await apiClient.get<{ card_token: string }>('/auth/card-token');
  return data;
}
