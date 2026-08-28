export type EmergencyContactType = 'police' | 'pompiers' | 'gendarmerie' | 'samu' | 'autre';

export interface EmergencyContact {
  id: string;
  type: EmergencyContactType;
  label: string;
  phone_number: string;
  region?: string;
  is_active: boolean;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  region?: string;
  radius_km?: number;
  is_active: boolean;
  created_at: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface TriggerSOSPayload {
  location: GeoPoint;
  trusted_contact_phone?: string;
  message?: string;
}

export interface SOSAlertResult {
  id: string;
  user_id: string;
  location: GeoPoint;
  trusted_contact_phone?: string;
  message?: string;
  emergency_contacts: EmergencyContact[];
  created_at: string;
}

export interface ReportIncidentPayload {
  title: string;
  description: string;
  location?: GeoPoint;
}

export type IncidentStatus = 'reported' | 'reviewing' | 'confirmed' | 'dismissed' | 'resolved';

export interface IncidentReportResult {
  id: string;
  reporter_id?: string;
  title: string;
  description: string;
  location?: GeoPoint;
  status: IncidentStatus;
  created_at: string;
}
