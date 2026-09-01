export type ExperienceType =
  | 'rencontre_habitant'
  | 'visite_village'
  | 'decouverte_metier'
  | 'atelier_artisanat'
  | 'atelier_culinaire'
  | 'agritourisme'
  | 'balade_guidee'
  | 'hebergement_habitant'
  | 'rencontre_artiste'
  | 'autre';

export interface RevenueShare {
  host_percent?: number;
  community_percent?: number;
  platform_percent?: number;
  notes?: string;
}

export interface ExperienceSummary {
  id: string;
  title: string;
  type: ExperienceType;
  host_name: string;
  region: string;
  city?: string;
  photo?: string;
  price_amount?: number;
  price_currency: string;
  average_rating: number;
  review_count: number;
}

export interface ExperienceDetail {
  id: string;
  title: string;
  description: string;
  type: ExperienceType;
  host_id: string;
  host_name: string;
  region: string;
  city?: string;
  location: { latitude: number; longitude: number };
  photos: string[];
  duration_minutes?: number;
  max_participants?: number;
  price_amount?: number;
  price_currency: string;
  languages: string[];
  revenue_share?: RevenueShare;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceFilters {
  type?: ExperienceType;
  region?: string;
  q?: string;
  page?: number;
  page_size?: number;
}
