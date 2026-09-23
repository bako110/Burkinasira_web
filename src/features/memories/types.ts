export type MemoryTargetType =
  | 'guide'
  | 'hotel'
  | 'restaurant'
  | 'transport'
  | 'destination'
  | 'event'
  | 'artisan_product'
  | 'experience';

export type MemoryMediaType = 'photo' | 'video';

export type MemoryStatus = 'published' | 'flagged' | 'hidden';

export interface Memory {
  id: string;
  target_type: MemoryTargetType;
  target_id: string;
  author_id: string;
  author_name?: string;
  author_avatar_url?: string;
  media_url: string;
  media_type: MemoryMediaType;
  title?: string;
  caption?: string;
  status: MemoryStatus;
  created_at: string;
}

export interface MemoryListResponse {
  items: Memory[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateMemoryPayload {
  target_type: MemoryTargetType;
  target_id: string;
  media_url: string;
  media_type: MemoryMediaType;
  title?: string;
  caption?: string;
}
