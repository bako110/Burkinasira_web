export type CultureContentType =
  | 'histoire'
  | 'patrimoine_materiel'
  | 'patrimoine_immateriel'
  | 'tradition'
  | 'langue'
  | 'conte_legende'
  | 'musique_danse'
  | 'artisanat'
  | 'costume'
  | 'gastronomie'
  | 'personnalite';

export interface CultureContentSummary {
  id: string;
  title: string;
  type: CultureContentType;
  media_type: 'texte' | 'audio' | 'video';
  summary?: string;
  cover_photo?: string;
  region?: string;
  province?: string;
  author?: string;
}

export interface CultureFilters {
  type?: CultureContentType;
  region?: string;
  province?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface CultureContentDetail {
  id: string;
  title: string;
  type: CultureContentType;
  media_type: 'texte' | 'audio' | 'video';
  summary?: string;
  content?: string;
  media_url?: string;
  cover_photo?: string;
  region?: string;
  province?: string;
  related_destination_ids?: string[];
  author?: string;
}
