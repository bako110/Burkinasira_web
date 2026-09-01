export type BusinessServiceType =
  | 'salle_conference'
  | 'seminaire'
  | 'congres'
  | 'team_building'
  | 'transport_groupe'
  | 'restauration_groupe'
  | 'prestataire_evenementiel'
  | 'photographie_audiovisuel';

export type QuoteRequestStatus = 'submitted' | 'in_review' | 'quoted' | 'accepted' | 'declined';

export interface CreateQuotePayload {
  company_name: string;
  service_types: BusinessServiceType[];
  region?: string;
  event_date?: string;
  participant_count: number;
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  requester_id: string;
  company_name: string;
  service_types: BusinessServiceType[];
  region?: string;
  event_date?: string;
  participant_count: number;
  notes?: string;
  quoted_amount?: number;
  currency: string;
  status: QuoteRequestStatus;
  created_at: string;
}

export interface AddEventParticipantPayload {
  full_name: string;
  email?: string;
  phone?: string;
}

export interface EventParticipant {
  id: string;
  quote_request_id: string;
  full_name: string;
  email?: string;
  phone?: string;
}
