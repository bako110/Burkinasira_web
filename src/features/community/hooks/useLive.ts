import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchLiveSessions, startLive, fetchLiveSession, endLive, fetchLiveToken } from '../api/community.api';

export function useLiveSessions(groupId?: string, refetchIntervalMs = 15000) {
  return useQuery({
    queryKey: ['community-live-sessions', groupId],
    queryFn: () => fetchLiveSessions(groupId),
    refetchInterval: refetchIntervalMs,
  });
}

export function useLiveSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['community-live-session', sessionId],
    queryFn: () => fetchLiveSession(sessionId as string),
    enabled: Boolean(sessionId),
    refetchInterval: 10000,
  });
}

export function useStartLive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startLive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-live-sessions'] }),
  });
}

export function useEndLive(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => endLive(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-live-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['community-live-session', sessionId] });
    },
  });
}

export function useLiveToken(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['community-live-token', sessionId],
    queryFn: () => fetchLiveToken(sessionId as string),
    enabled: Boolean(sessionId),
    staleTime: Infinity, // un token n'a pas besoin d'être refetch automatiquement
  });
}
