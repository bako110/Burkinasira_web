import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markNotificationAsRead } from '../api/notifications.api';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
