import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sendMessage } from '../api/assistant.api';

export function useSendAssistantMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (conversation) => {
      queryClient.setQueryData(['assistant-conversation', conversation.id], conversation);
      queryClient.invalidateQueries({ queryKey: ['assistant-conversations'] });
    },
  });
}
