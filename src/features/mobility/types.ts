export type TransportType =
  | 'taxi_vtc'
  | 'chauffeur_prive'
  | 'location_voiture'
  | 'location_moto'
  | 'transport_interurbain'
  | 'transfert_aeroport'
  | 'transport_touristique_prive';

export interface TransportProviderSummary {
  id: string;
  name: string;
  type: TransportType;
  region: string;
  province?: string;
  city?: string;
  price_estimate?: number;
  price_currency: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
}

export interface MobilityFilters {
  type?: TransportType;
  region?: string;
  province?: string;
  page?: number;
  page_size?: number;
}

export type TransportProviderStatus = 'pending' | 'active' | 'suspended';

export interface TransportProviderDetail {
  id: string;
  name: string;
  type: TransportType;
  description?: string;
  region: string;
  province?: string;
  city?: string;
  base_location?: { latitude: number; longitude: number };
  vehicle_info?: string;
  price_estimate?: number;
  price_currency: string;
  contact_phone?: string;
  is_verified: boolean;
  status: TransportProviderStatus;
  average_rating: number;
  review_count: number;
}
