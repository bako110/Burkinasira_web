export type DiasporaContentType =
  | 'circuit_culturel'
  | 'patrimoine_familial'
  | 'hebergement'
  | 'transport'
  | 'evenement_culturel'
  | 'service_visiteur_retour';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface DiasporaContent {
  id: string;
  title: string;
  type: DiasporaContentType;
  description: string;
  region?: string;
  location?: GeoPoint;
  related_destination_id?: string;
  created_at: string;
}

export interface DiasporaContentFilters {
  type?: DiasporaContentType;
  region?: string;
  q?: string;
}

export type CommunityMeetupStatus = 'planned' | 'cancelled' | 'completed';

export interface CommunityMeetup {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  region: string;
  location?: GeoPoint;
  scheduled_at: string;
  status: CommunityMeetupStatus;
  participant_ids: string[];
}

export interface CreateMeetupPayload {
  title: string;
  description?: string;
  region: string;
  location?: GeoPoint;
  scheduled_at: string;
}
