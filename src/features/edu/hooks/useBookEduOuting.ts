import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookEduOuting } from '../api/edu.api';

export function useBookEduOuting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookEduOuting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edu-my-bookings'] });
    },
  });
}
