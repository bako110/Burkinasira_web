import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePost } from '../api/community.api';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
}
