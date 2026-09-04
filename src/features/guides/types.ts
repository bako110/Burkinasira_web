export interface GuideSummary {
  id: string;
  display_name: string;
  slug: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  provinces_covered: string[];
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  daily_rate?: number;
  currency: string;
}

export interface GuideFilters {
  region?: string;
  province?: string;
  language?: string;
  specialty?: string;
  verified_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface Certification {
  title: string;
  issued_by?: string;
  document_url?: string;
}

export interface GuideDetail {
  id: string;
  user_id: string;
  display_name: string;
  slug: string;
  bio?: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  provinces_covered: string[];
  certifications: Certification[];
  hourly_rate?: number;
  daily_rate?: number;
  currency: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  visits_completed: number;
}

export interface AvailabilitySlot {
  id: string;
  guide_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}
