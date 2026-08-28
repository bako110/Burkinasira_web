import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likePost } from '../api/community.api';

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
}
