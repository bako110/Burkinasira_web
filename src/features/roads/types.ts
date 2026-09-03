export type RoadServiceType =
  | 'station_service'
  | 'garage'
  | 'mecanicien'
  | 'vulcanisateur'
  | 'depannage'
  | 'remorquage'
  | 'lavage_auto'
  | 'pieces_auto'
  | 'parking'
  | 'borne_recharge';

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

export interface RoadServiceSummary {
  id: string;
  name: string;
  type: RoadServiceType;
  region: string;
  city?: string;
  location: GeoPoint;
  offers_24h: boolean;
  contact_phone?: string;
}

export interface RoadServiceDetail {
  id: string;
  name: string;
  type: RoadServiceType;
  description?: string;
  region: string;
  city?: string;
  location: GeoPoint;
  address?: string;
  opening_hours: OpeningHours[];
  offers_24h: boolean;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface RoadServiceFilters {
  type?: RoadServiceType;
  region?: string;
  q?: string;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}

export interface ReportBreakdownPayload {
  location: GeoPoint;
  description?: string;
}

export type BreakdownReportStatus = 'open' | 'assigned' | 'resolved' | 'cancelled';

export interface BreakdownReport {
  id: string;
  reporter_id: string;
  location: GeoPoint;
  description?: string;
  assigned_service_id?: string;
  status: BreakdownReportStatus;
  created_at: string;
}
