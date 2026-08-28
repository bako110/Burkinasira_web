import { useMutation, useQueryClient } from '@tanstack/react-query';

import { startConversation } from '../api/messaging.api';

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
