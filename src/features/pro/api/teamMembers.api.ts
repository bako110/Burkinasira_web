import { apiClient } from '../../../shared/api/client';
import type { InviteTeamMemberPayload, ProviderItemType, TeamMember } from '../types';

export async function fetchTeamMembers(itemType: ProviderItemType, itemId: string): Promise<TeamMember[]> {
  const { data } = await apiClient.get<TeamMember[]>('/pro/team', {
    params: { establishment_type: itemType, establishment_id: itemId },
  });
  return data;
}

export async function inviteTeamMember(payload: InviteTeamMemberPayload): Promise<TeamMember> {
  const { data } = await apiClient.post<TeamMember>('/pro/team', payload);
  return data;
}

export async function removeTeamMember(memberId: string): Promise<void> {
  await apiClient.delete(`/pro/team/${memberId}`);
}
