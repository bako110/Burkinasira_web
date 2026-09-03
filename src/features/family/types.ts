export type FamilyServiceType =
  | 'activite_familiale'
  | 'sanitaire_public'
  | 'espace_repos'
  | 'aire_jeux'
  | 'garde_enfants'
  | 'point_eau';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface FamilyServiceSummary {
  id: string;
  name: string;
  type: FamilyServiceType;
  region: string;
  city?: string;
  location: GeoPoint;
  is_family_friendly: boolean;
}

export interface FamilyServiceDetail {
  id: string;
  name: string;
  type: FamilyServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  is_family_friendly: boolean;
  is_verified_provider: boolean;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyServiceFilters {
  type?: FamilyServiceType;
  region?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface BookChildcarePayload {
  service_id: string;
  requested_date: string;
  notes?: string;
}

export type ChildcareBookingStatus = 'requested' | 'confirmed' | 'cancelled';

export interface ChildcareBooking {
  id: string;
  service_id: string;
  parent_id: string;
  requested_date: string;
  notes?: string;
  status: ChildcareBookingStatus;
  created_at: string;
}
