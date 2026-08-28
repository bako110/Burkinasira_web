export type EventCategory =
  | 'festival'
  | 'concert'
  | 'foire'
  | 'exposition'
  | 'culturel'
  | 'sportif'
  | 'gastronomique'
  | 'ceremonie_traditionnelle'
  | 'conference'
  | 'salon';

export interface EventSummary {
  id: string;
  title: string;
  category: EventCategory;
  region: string;
  city?: string;
  photo?: string;
  start_date: string;
  end_date?: string;
  ticket_price?: number;
  currency: string;
  requires_ticket: boolean;
}

export interface EventFilters {
  category?: EventCategory;
  region?: string;
  upcoming_only?: boolean;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface ProgramItem {
  time?: string;
  title: string;
  description?: string;
}

export interface EventDetail {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  region: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  photos: string[];
  start_date: string;
  end_date?: string;
  program: ProgramItem[];
  ticket_price?: number;
  currency: string;
  requires_ticket: boolean;
  linked_hotel_ids?: string[];
  linked_transport_provider_ids?: string[];
}

