export type EstablishmentType = 'restaurant' | 'maquis' | 'cafe' | 'street_food' | 'etablissement_touristique';
export type DietaryTag = 'famille' | 'vegetarien' | 'budget';

export interface RestaurantSummary {
  id: string;
  name: string;
  slug: string;
  type: EstablishmentType;
  cuisine_style?: string;
  region: string;
  province?: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  photo?: string;
  dietary_tags: DietaryTag[];
  average_rating: number;
  review_count: number;
}

export interface RestaurantFilters {
  type?: EstablishmentType;
  region?: string;
  province?: string;
  city?: string;
  dietary_tag?: DietaryTag;
  q?: string;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}

export interface OpeningHours {
  day: string;
  open_time?: string;
  close_time?: string;
  closed: boolean;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  currency: string;
  is_specialty: boolean;
}

export type RestaurantStatus = 'draft' | 'published' | 'archived';

export interface RestaurantDetail {
  id: string;
  name: string;
  slug: string;
  type: EstablishmentType;
  description?: string;
  cuisine_style?: string;
  region: string;
  province?: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  photos: string[];
  videos: string[];
  opening_hours: OpeningHours[];
  menu: MenuItem[];
  dietary_tags: DietaryTag[];
  accepts_table_booking: boolean;
  offers_takeaway: boolean;
  offers_cooking_workshop: boolean;
  contact_phone?: string;
  contact_email?: string;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  status: RestaurantStatus;
}
