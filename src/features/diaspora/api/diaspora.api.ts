import { apiClient } from '../../../shared/api/client';
import type {
  CommunityMeetup,
  CreateMeetupPayload,
  DiasporaContent,
  DiasporaContentFilters,
} from '../types';

export async function fetchDiasporaContent(
  filters: DiasporaContentFilters = {},
): Promise<DiasporaContent[]> {
  const { data } = await apiClient.get<DiasporaContent[]>('/diaspora/content', {
    params: filters,
  });
  return data;
}

export async function fetchDiasporaContentById(contentId: string): Promise<DiasporaContent> {
  const { data } = await apiClient.get<DiasporaContent>(`/diaspora/content/${contentId}`);
  return data;
}

export async function fetchMeetups(region?: string): Promise<CommunityMeetup[]> {
  const { data } = await apiClient.get<CommunityMeetup[]>('/diaspora/meetups', {
    params: region ? { region } : {},
  });
  return data;
}

export async function createMeetup(payload: CreateMeetupPayload): Promise<CommunityMeetup> {
  const { data } = await apiClient.post<CommunityMeetup>('/diaspora/meetups', payload);
  return data;
}

export async function joinMeetup(meetupId: string): Promise<CommunityMeetup> {
  const { data } = await apiClient.post<CommunityMeetup>(`/diaspora/meetups/${meetupId}/join`);
  return data;
}
