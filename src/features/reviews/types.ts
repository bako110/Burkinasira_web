export type {
  Review,
  ReviewListResponse,
  ReviewStatus,
  ReviewTargetType,
} from '../pro/types';

export interface CreateReviewPayload {
  booking_id: string;
  rating: number;
  comment?: string;
  photos?: string[];
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
  photos?: string[];
}
