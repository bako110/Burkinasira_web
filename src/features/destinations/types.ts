export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface OpeningHours {
  day: string;
  open_time?: string;
  close_time?: string;
  closed: boolean;
}

export interface DataSource {
  verified: boolean;
  source?: string;
  last_updated_at?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  region?: string;
  province?: string;
  city?: string;
  location?: GeoPoint;
  photo?: string;
  average_rating?: number;
  review_count?: number;
}

export interface DestinationDetail extends Omit<Destination, 'photo'> {
  address?: string;
  photos?: string[];
  videos?: string[];
  opening_hours?: OpeningHours[];
  price_info?: string;
  contact_phone?: string;
  contact_email?: string;
  booking_url?: string;
  services_on_site?: string[];
  accessibility?: {
    wheelchair_accessible?: boolean | null;
    notes?: string | null;
  };
  history?: string;
  data_source?: DataSource;
  created_at?: string;
  updated_at?: string;
}

export interface DestinationFilters {
  category?: string;
  region?: string;
  q?: string;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}
