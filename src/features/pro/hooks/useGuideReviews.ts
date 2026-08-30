import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyGuideReviews, fetchReviewsForTarget, replyToReview } from '../api/guideReviews.api';
import type { ReplyReviewPayload, ReviewTargetType } from '../types';

export function useMyGuideReviews(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['my-guide-reviews', page, pageSize],
    queryFn: () => fetchMyGuideReviews(page, pageSize),
  });
}

export function useReviewsForTarget(
  targetType: ReviewTargetType,
  targetId: string | undefined,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ['reviews-for-target', targetType, targetId, page, pageSize],
    queryFn: () => fetchReviewsForTarget(targetType, targetId as string, page, pageSize),
    enabled: Boolean(targetId),
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
