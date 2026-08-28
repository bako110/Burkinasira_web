import { apiClient } from '../../../shared/api/client';
import type { UserPublic } from '../../../shared/api/types';
import type { ChangePasswordPayload, UpdateProfilePayload } from '../types';

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserPublic> {
  const { data } = await apiClient.patch<UserPublic>('/auth/me', payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', payload);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/auth/me');
}
