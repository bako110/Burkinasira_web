export type HealthFacilityType =
  | 'pharmacie'
  | 'hopital'
  | 'clinique'
  | 'laboratoire'
  | 'centre_premiers_secours'
  | 'dentiste'
  | 'autre';

export interface HealthFacilitySummary {
  id: string;
  name: string;
  type: HealthFacilityType;
  region: string;
  city?: string;
  is_on_duty?: boolean;
  contact_phone?: string;
}

export interface HealthFacilityFilters {
  type?: HealthFacilityType;
  region?: string;
  on_duty_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface OpeningHours {
  day: string;
  open_time?: string;
  close_time?: string;
  closed: boolean;
}

export interface HealthFacilityDetail {
  id: string;
  name: string;
  type: HealthFacilityType;
  description?: string;
  region: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  opening_hours: OpeningHours[];
  is_on_duty?: boolean;
  services: string[];
  contact_phone?: string;
}
