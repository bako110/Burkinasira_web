export type EduOutingType =
  | 'visite_historique'
  | 'visite_culturelle'
  | 'visite_scientifique'
  | 'visite_agricole'
  | 'visite_industrielle'
  | 'excursion_universitaire';

export type EduBookingStatus = 'requested' | 'confirmed' | 'cancelled';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface EduOuting {
  id: string;
  organizer_id: string;
  title: string;
  type: EduOutingType;
  description: string;
  region: string;
  city?: string;
  location?: GeoPoint;
  target_level?: string;
  price_per_participant?: number;
  currency: string;
  max_participants?: number;
  created_at: string;
}

export interface EduOutingFilters {
  type?: EduOutingType;
  region?: string;
  page?: number;
  page_size?: number;
}

export interface CreateEduBookingPayload {
  outing_id: string;
  group_name: string;
  participant_count: number;
}

export interface EduBooking {
  id: string;
  outing_id: string;
  booked_by: string;
  group_name: string;
  participant_count: number;
  status: EduBookingStatus;
  created_at: string;
}

export interface EduParticipant {
  id: string;
  booking_id: string;
  full_name: string;
  notes?: string;
}
