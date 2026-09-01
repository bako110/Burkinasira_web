import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMeetup } from '../api/diaspora.api';

export function useCreateMeetup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaspora-meetups'] });
    },
  });
}
