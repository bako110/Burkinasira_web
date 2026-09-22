export type PostType = 'photo' | 'video' | 'carnet_voyage' | 'recommandation';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Post {
  id: string;
  author_id: string;
  author_name?: string;
  author_avatar_url?: string;
  type: PostType;
  caption?: string;
  media_urls: string[];
  related_destination_id?: string;
  related_experience_id?: string;
  related_experience_title?: string;
  group_id?: string;
  location?: GeoPoint;
  like_count: number;
  comment_count: number;
  is_liked_by_me: boolean;
  created_at: string;
}

export interface CreatePostPayload {
  type: PostType;
  caption?: string;
  media_urls?: string[];
  related_destination_id?: string;
  related_experience_id?: string;
  group_id?: string;
  location?: GeoPoint;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface CreateCommentPayload {
  content: string;
}

export interface FavoriteList {
  id: string;
  owner_id: string;
  name: string;
  destination_ids: string[];
  created_at: string;
}

export interface CreateFavoriteListPayload {
  name: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  cover_photo?: string;
  region?: string;
  province?: string;
  theme?: string;
  creator_id: string;
  member_ids: string[];
  conversation_id?: string;
  is_public: boolean;
  created_at: string;
}

export interface GroupMember {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  cover_photo?: string;
  region?: string;
  province?: string;
  theme?: string;
  creator_id: string;
  members: GroupMember[];
  conversation_id?: string;
  is_public: boolean;
  created_at: string;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
  cover_photo?: string;
  region?: string;
  theme?: string;
  is_public?: boolean;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  cover_photo?: string;
  region?: string;
  province?: string;
  theme?: string;
  is_public?: boolean;
}

export const GROUP_THEMES = [
  'randonnee',
  'gastronomie',
  'culture',
  'aventure',
  'famille',
  'diaspora',
  'affaires',
  'photographie',
] as const;

export type GroupTheme = (typeof GROUP_THEMES)[number];

export type QuestionStatus = 'open' | 'answered';

export interface Question {
  id: string;
  author_id: string;
  title: string;
  content: string;
  related_destination_id?: string;
  status: QuestionStatus;
  created_at: string;
}

export interface CreateQuestionPayload {
  title: string;
  content: string;
  related_destination_id?: string;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface CreateAnswerPayload {
  content: string;
}

export type ReportedContentType = 'post' | 'comment' | 'question' | 'answer';

export interface ReportContentPayload {
  content_type: ReportedContentType;
  content_id: string;
  reason: string;
}

export type LiveSessionStatus = 'live' | 'ended';

export interface LiveSession {
  id: string;
  host_id: string;
  host_name?: string;
  host_avatar_url?: string;
  title: string;
  description?: string;
  group_id?: string;
  room_name: string;
  status: LiveSessionStatus;
  viewer_count: number;
  started_at: string;
  ended_at?: string;
}

export interface StartLivePayload {
  title: string;
  description?: string;
  group_id?: string;
}

export interface LiveToken {
  url: string;
  token: string;
  room_name: string;
  can_publish: boolean;
}
