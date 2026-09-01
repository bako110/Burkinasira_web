import { useMutation, useQueryClient } from '@tanstack/react-query';

import { joinMeetup } from '../api/diaspora.api';

export function useJoinMeetup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinMeetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaspora-meetups'] });
    },
  });
}
