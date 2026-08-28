import { useQuery } from '@tanstack/react-query';

import { fetchMessages } from '../api/messaging.api';

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
    refetchInterval: 5_000,
  });
}
