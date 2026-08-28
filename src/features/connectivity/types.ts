export type ConnectivityPointType =
  | 'operateur_telecom'
  | 'point_vente_sim'
  | 'wifi_public'
  | 'wifi_prive'
  | 'coworking'
  | 'boutique_telephonie';

export interface ConnectivityPointSummary {
  id: string;
  name: string;
  type: ConnectivityPointType;
  operator?: string;
  region: string;
  city?: string;
  is_free?: boolean;
  offers_esim?: boolean;
  contact_phone?: string;
}

export interface ConnectivityFilters {
  type?: ConnectivityPointType;
  region?: string;
  page?: number;
  page_size?: number;
}

export interface ConnectivityPointDetail {
  id: string;
  name: string;
  type: ConnectivityPointType;
  operator?: string;
  region: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  is_free?: boolean;
  offers_esim?: boolean;
  contact_phone?: string;
}
