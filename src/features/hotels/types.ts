export type AccommodationType =
  | 'hotel'
  | 'auberge'
  | 'campement'
  | 'maison_hotes'
  | 'residence'
  | 'hebergement_habitant'
  | 'hebergement_communautaire';

export interface HotelSummary {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  region: string;
  province?: string;
  city?: string;
  photo?: string;
  min_price?: number;
  currency: string;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
}

export interface HotelFilters {
  type?: AccommodationType;
  region?: string;
  province?: string;
  city?: string;
  max_price?: number;
  amenity?: string;
  q?: string;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}

export interface RoomType {
  name: string;
  capacity: number;
  price_per_night: number;
  currency: string;
  total_rooms: number;
  amenities: string[];
}

export interface HotelOffer {
  title: string;
  description?: string;
  discount_percent?: number;
  valid_from?: string;
  valid_until?: string;
}

export type HotelStatus = 'draft' | 'published' | 'archived';

export interface HotelDetail {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  description?: string;
  region: string;
  province?: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  photos: string[];
  videos: string[];
  amenities: string[];
  room_types: RoomType[];
  offers: HotelOffer[];
  contact_phone?: string;
  contact_email?: string;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  status: HotelStatus;
}
