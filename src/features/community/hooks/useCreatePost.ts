import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPost } from '../api/community.api';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
}
