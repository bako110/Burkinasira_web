import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createReview,
  fetchMyReviews,
  fetchReviewsForTarget,
  markReviewHelpful,
  updateReview,
} from './api';
import type { CreateReviewPayload, ReviewTargetType, UpdateReviewPayload } from './types';

const MY_REVIEWS_KEY = ['reviews', 'mine'] as const;

/** Mes avis publiés — sert à masquer le bouton "Noter" d'une réservation déjà notée. */
export function useMyReviews() {
  return useQuery({ queryKey: MY_REVIEWS_KEY, queryFn: fetchMyReviews });
}

/** Set des booking_id déjà notés, pour un lookup O(1) dans les listes. */
export function useReviewedBookingIds(): Set<string> {
  const { data } = useMyReviews();
  return new Set((data ?? []).map((r) => r.booking_id));
}

export function useReviewsForTarget(targetType: ReviewTargetType, targetId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['reviews', 'target', targetType, targetId],
    queryFn: () => fetchReviewsForTarget(targetType, targetId as string),
    enabled: Boolean(targetId) && enabled,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'target', review.target_type, review.target_id] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) => updateReview(id, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: MY_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'target', review.target_type, review.target_id] });
    },
  });
}

export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => markReviewHelpful(reviewId),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'target', review.target_type, review.target_id] });
    },
  });
}
