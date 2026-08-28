import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchGroups, fetchGroupDetail, createGroup, joinGroup, leaveGroup } from '../api/community.api';

export function useGroups(publicOnly = true, region?: string, theme?: string) {
  return useQuery({
    queryKey: ['community-groups', publicOnly, region, theme],
    queryFn: () => fetchGroups(publicOnly, region, theme),
  });
}

export function useGroupDetail(groupId: string | undefined) {
  return useQuery({
    queryKey: ['community-group', groupId],
    queryFn: () => fetchGroupDetail(groupId as string),
    enabled: Boolean(groupId),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-groups'] }),
  });
}

export function useJoinGroup(groupId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-groups'] });
      if (groupId) queryClient.invalidateQueries({ queryKey: ['community-group', groupId] });
    },
  });
}

export function useLeaveGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-groups'] });
      queryClient.invalidateQueries({ queryKey: ['community-group', groupId] });
    },
  });
}
