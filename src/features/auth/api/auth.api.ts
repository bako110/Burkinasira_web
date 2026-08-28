import { apiClient } from '../../../shared/api/client';
import type { TokenResponse, UserPublic } from '../../../shared/api/types';
import type { LoginPayload, RegisterPayload } from '../types';

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', payload);
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
