import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAllNotificationsAsRead } from '../api/notifications.api';

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
