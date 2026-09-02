export type MoneyServiceType = 'banque' | 'distributeur' | 'mobile_money' | 'bureau_change';

export interface MoneyServiceSummary {
  id: string;
  name: string;
  slug: string;
  type: MoneyServiceType;
  operator?: string;
  region: string;
  province?: string;
  city?: string;
  contact_phone?: string;
}

export interface MoneyServiceFilters {
  type?: MoneyServiceType;
  region?: string;
  province?: string;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
  page?: number;
  page_size?: number;
}

export interface OpeningHours {
  day: string;
  open_time?: string;
  close_time?: string;
  closed: boolean;
}

export interface MoneyServiceDetail {
  id: string;
  name: string;
  slug: string;
  type: MoneyServiceType;
  operator?: string;
  region: string;
  province?: string;
  city?: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  opening_hours: OpeningHours[];
  contact_phone?: string;
}
