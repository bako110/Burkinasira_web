export interface GuideSummary {
  id: string;
  display_name: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  daily_rate?: number;
  currency: string;
}

export interface GuideFilters {
  region?: string;
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
  display_name: string;
  bio?: string;
  photo_url?: string;
  languages: string[];
  specialties: string[];
  regions_covered: string[];
  certifications: Certification[];
  hourly_rate?: number;
  daily_rate?: number;
  currency: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  visits_completed: number;
}
