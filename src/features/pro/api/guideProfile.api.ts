import { apiClient } from '../../../shared/api/client';
import type { CreateGuideProfilePayload, MyGuideProfile, UpdateGuideProfilePayload } from '../types';

export async function fetchMyGuideProfile(): Promise<MyGuideProfile | null> {
  try {
    const { data } = await apiClient.get<MyGuideProfile>('/guides/me');
    return data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 404) return null;
    }
    throw err;
  }
}

export async function createMyGuideProfile(payload: CreateGuideProfilePayload): Promise<MyGuideProfile> {
  const { data } = await apiClient.post<MyGuideProfile>('/guides', payload);
  return data;
}

export async function updateMyGuideProfile(payload: UpdateGuideProfilePayload): Promise<MyGuideProfile> {
  const { data } = await apiClient.patch<MyGuideProfile>('/guides/me', payload);
  return data;
}
