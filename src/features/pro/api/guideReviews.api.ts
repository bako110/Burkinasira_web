import { apiClient } from '../../../shared/api/client';
import type { ReplyReviewPayload, Review, ReviewListResponse } from '../types';

export async function fetchMyGuideReviews(page = 1, pageSize = 20): Promise<ReviewListResponse> {
  const { data } = await apiClient.get<ReviewListResponse>('/guides/me/reviews', {
    params: { page, page_size: pageSize },
  });
  return data;
}

export async function replyToReview(reviewId: string, payload: ReplyReviewPayload): Promise<Review> {
  const { data } = await apiClient.post<Review>(`/reviews/${reviewId}/reply`, payload);
  return data;
}
