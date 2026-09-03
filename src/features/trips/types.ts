export type TripThemeType =
  | 'budget'
  | 'duree'
  | 'region'
  | 'culturel'
  | 'nature'
  | 'familial'
  | 'gastronomique'
  | 'affaires';

export type TripStatus = 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type TripItemType =
  | 'destination'
  | 'hotel'
  | 'restaurant'
  | 'experience'
  | 'event'
  | 'guide'
  | 'transport'
  | 'autre';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface TripDayItem {
  time?: string;
  type: TripItemType;
  reference_id?: string;
  title: string;
  notes?: string;
  estimated_cost?: number;
  location?: GeoPoint;
}

export interface TripDay {
  date: string;
  items: TripDayItem[];
}

export interface TripCollaborator {
  user_id: string;
  can_edit: boolean;
}

export interface TripSummary {
  id: string;
  title: string;
  themes: TripThemeType[];
  region?: string;
  start_date?: string;
  end_date?: string;
  status: TripStatus;
  budget_estimate?: number;
  currency: string;
}

export interface TripDetail {
  id: string;
  owner_id: string;
  title: string;
  themes: TripThemeType[];
  region?: string;
  start_date?: string;
  end_date?: string;
  budget_estimate?: number;
  currency: string;
  days: TripDay[];
  linked_booking_ids: string[];
  collaborators: TripCollaborator[];
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTripPayload {
  title: string;
  themes?: TripThemeType[];
  region?: string;
  start_date?: string;
  end_date?: string;
  budget_estimate?: number;
  currency?: string;
}

export interface UpdateTripPayload {
  title?: string;
  themes?: TripThemeType[];
  region?: string;
  start_date?: string;
  end_date?: string;
  budget_estimate?: number;
  currency?: string;
  status?: TripStatus;
}

export interface AddTripDayItemPayload {
  date: string;
  item: TripDayItem;
}

export interface RemoveTripDayItemPayload {
  date: string;
  item_index: number;
}
