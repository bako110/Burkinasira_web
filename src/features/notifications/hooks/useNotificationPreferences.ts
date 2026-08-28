import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyNotificationPreferences, updateMyNotificationPreferences } from '../api/notifications.api';

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: fetchMyNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyNotificationPreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-preferences'], data);
    },
  });
}
