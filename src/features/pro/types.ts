export type VerificationDocumentType =
  | 'piece_identite'
  | 'document_professionnel'
  | 'justificatif_adresse'
  | 'autre';

export type VerificationStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: VerificationDocumentType;
  document_url: string;
  status: VerificationStatus;
  review_notes?: string;
  created_at: string;
}

export interface SubmitVerificationPayload {
  document_type: VerificationDocumentType;
  document_url: string;
}

export type GuideStatus = 'pending' | 'active' | 'suspended';

export interface MyGuideProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  hourly_rate?: number;
  daily_rate?: number;
  currency: string;
  is_verified: boolean;
  status: GuideStatus;
  rejection_reason?: string;
}

export interface CreateGuideProfilePayload {
  display_name: string;
  bio?: string;
  photo_url?: string;
  languages?: string[];
  specialties?: string[];
  regions_covered?: string[];
  hourly_rate?: number;
  daily_rate?: number;
  currency?: string;
}

export type UpdateGuideProfilePayload = Partial<CreateGuideProfilePayload>;

export interface AvailabilitySlot {
  id: string;
  guide_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export interface CreateAvailabilitySlotPayload {
  date: string;
  start_time: string;
  end_time: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';

export interface GuideBooking {
  id: string;
  booking_reference: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  item_type: string;
  item_id: string;
  item_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  currency: string;
  scheduled_date?: string;
  status: BookingStatus;
  ticket_qr_code: string;
  cancellation_reason?: string;
  created_at: string;
}

export type ReviewTargetType =
  | 'guide'
  | 'hotel'
  | 'restaurant'
  | 'transport'
  | 'destination'
  | 'event'
  | 'artisan_product';

export type ReviewStatus = 'published' | 'flagged' | 'hidden';

export interface Review {
  id: string;
  target_type: ReviewTargetType;
  target_id: string;
  author_id: string;
  author_name?: string;
  author_avatar_url?: string;
  booking_id: string;
  rating: number;
  comment?: string;
  photos: string[];
  reply_comment?: string;
  reply_at?: string;
  status: ReviewStatus;
  report_count: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  page: number;
  page_size: number;
  average_rating: number;
  rating_breakdown: Record<string, number>;
}

export interface ReplyReviewPayload {
  reply_comment: string;
}

export interface AnalyticsTimeSeriesPoint {
  period: string;
  customer_count: number;
  booking_count: number;
  revenue: number;
}

export interface GuideAnalyticsSummary {
  currency: string;
  total_customers: number;
  total_bookings: number;
  total_revenue: number;
  average_booking_value: number;
  completion_rate: number;
  daily: AnalyticsTimeSeriesPoint[];
  monthly: AnalyticsTimeSeriesPoint[];
  yearly: AnalyticsTimeSeriesPoint[];
}
