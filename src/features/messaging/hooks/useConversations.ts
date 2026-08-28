import { useQuery } from '@tanstack/react-query';

import { fetchConversations } from '../api/messaging.api';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    refetchInterval: 15_000,
  });
}
