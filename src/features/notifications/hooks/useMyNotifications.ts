import { useQuery } from '@tanstack/react-query';

import { fetchMyNotifications } from '../api/notifications.api';

export function useMyNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => fetchMyNotifications(unreadOnly),
    refetchInterval: 60_000,
  });
}
