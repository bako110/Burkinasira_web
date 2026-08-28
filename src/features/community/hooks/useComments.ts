import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchComments, addComment } from '../api/community.api';
import type { CreateCommentPayload } from '../types';

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => fetchComments(postId as string),
    enabled: Boolean(postId),
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => addComment(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
}
