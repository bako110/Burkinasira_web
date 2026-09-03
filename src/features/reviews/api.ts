import { apiClient } from '../../shared/api/client';
import type {
  CreateReviewPayload,
  Review,
  ReviewListResponse,
  ReviewTargetType,
  UpdateReviewPayload,
} from './types';

/** Créer un avis vérifié sur une réservation terminée. */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const { data } = await apiClient.post<Review>('/reviews', payload);
  return data;
}

export async function updateReview(reviewId: string, payload: UpdateReviewPayload): Promise<Review> {
  const { data } = await apiClient.patch<Review>(`/reviews/${reviewId}`, payload);
  return data;
}

/** Mes avis déjà publiés (pour savoir quelles réservations sont déjà notées). */
export async function fetchMyReviews(): Promise<Review[]> {
  const { data } = await apiClient.get<Review[]>('/reviews/me');
  return data;
}

/** Avis publiés d'une cible (guide, hôtel, resto, transport, destination, événement). */
export async function fetchReviewsForTarget(
  targetType: ReviewTargetType,
  targetId: string,
  page = 1,
  pageSize = 20,
): Promise<ReviewListResponse> {
  const { data } = await apiClient.get<ReviewListResponse>(
    `/reviews/target/${targetType}/${targetId}`,
    { params: { page, page_size: pageSize } },
  );
  return data;
}

export async function markReviewHelpful(reviewId: string): Promise<Review> {
  const { data } = await apiClient.post<Review>(`/reviews/${reviewId}/helpful`);
  return data;
}
