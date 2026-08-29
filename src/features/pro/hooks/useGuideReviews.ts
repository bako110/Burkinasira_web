import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyGuideReviews, replyToReview } from '../api/guideReviews.api';
import type { ReplyReviewPayload } from '../types';

export function useMyGuideReviews(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['my-guide-reviews', page, pageSize],
    queryFn: () => fetchMyGuideReviews(page, pageSize),
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: ReplyReviewPayload }) =>
      replyToReview(reviewId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-reviews'] }),
  });
}
