import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchTeamMembers, inviteTeamMember, removeTeamMember } from '../api/teamMembers.api';
import type { InviteTeamMemberPayload, ProviderItemType } from '../types';

export function useTeamMembers(itemType: ProviderItemType, itemId: string) {
  return useQuery({
    queryKey: ['team-members', itemType, itemId],
    queryFn: () => fetchTeamMembers(itemType, itemId),
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteTeamMemberPayload) => inviteTeamMember(payload),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: ['team-members', variables.establishment_type, variables.establishment_id],
      }),
  });
}

export function useRemoveTeamMember(itemType: ProviderItemType, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => removeTeamMember(memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-members', itemType, itemId] }),
  });
}
