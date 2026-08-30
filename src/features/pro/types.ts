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

export type ProviderItemType = 'hotel' | 'restaurant' | 'transport' | 'product';

export interface GeoPointPayload {
  latitude: number;
  longitude: number;
}

export interface RoomTypePayload {
  name: string;
  capacity: number;
  price_per_night: number;
  currency: string;
  total_rooms: number;
  amenities: string[];
}

export interface OpeningHoursPayload {
  day: string;
  open_time?: string;
  close_time?: string;
  closed: boolean;
}

export interface MenuItemPayload {
  name: string;
  description?: string;
  price?: number;
  currency: string;
  is_specialty: boolean;
}

export interface CreateHotelPayload {
  name: string;
  type: string;
  description: string;
  region: string;
  province?: string;
  city?: string;
  location: GeoPointPayload;
  address?: string;
  photos?: string[];
  videos?: string[];
  amenities?: string[];
  room_types?: RoomTypePayload[];
  contact_phone?: string;
  contact_email?: string;
}

export interface CreateRestaurantPayload {
  name: string;
  type: string;
  description: string;
  cuisine_style?: string;
  region: string;
  province?: string;
  city?: string;
  location: GeoPointPayload;
  address?: string;
  photos?: string[];
  videos?: string[];
  opening_hours?: OpeningHoursPayload[];
  menu?: MenuItemPayload[];
  dietary_tags?: string[];
  accepts_table_booking?: boolean;
  offers_takeaway?: boolean;
  offers_cooking_workshop?: boolean;
  contact_phone?: string;
  contact_email?: string;
}

export interface CreateTransportProviderPayload {
  name: string;
  type: string;
  description?: string;
  region: string;
  province?: string;
  city?: string;
  base_location?: GeoPointPayload;
  vehicle_info?: string;
  photos?: string[];
  videos?: string[];
  price_estimate?: number;
  price_currency?: string;
  contact_phone: string;
}

export interface CreateArtisanProfilePayload {
  display_name: string;
  story?: string;
  photo_url?: string;
  photos?: string[];
  videos?: string[];
  region: string;
  province?: string;
  city?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  photos?: string[];
  videos?: string[];
  stock_quantity?: number;
  fulfillment_mode?: string;
}

export type TeamMemberRole = 'owner' | 'manager' | 'staff';

export interface TeamMember {
  id: string;
  provider_id: string;
  user_id?: string;
  email: string;
  role: TeamMemberRole;
  establishment_type?: ProviderItemType;
  establishment_id?: string;
  is_active: boolean;
  account_created: boolean;
}

export interface InviteTeamMemberPayload {
  email: string;
  full_name: string;
  temporary_password: string;
  role: TeamMemberRole;
  establishment_type: ProviderItemType;
  establishment_id: string;
}