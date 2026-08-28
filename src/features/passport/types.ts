export type BadgeCategory = 'decouverte' | 'culture' | 'gastronomie' | 'nature' | 'communaute' | 'fidelite';

export interface Stamp {
  destination_id: string;
  destination_name: string;
  collected_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon_url?: string;
  criteria?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target_count: number;
  related_category?: string;
  reward_badge_id?: string;
  status: 'active' | 'archived';
  created_at: string;
}

export interface UserChallengeProgress {
  challenge_id: string;
  current_count: number;
  completed: boolean;
  completed_at?: string;
}

export interface Passport {
  id: string;
  user_id: string;
  stamps: Stamp[];
  earned_badge_ids: string[];
  challenge_progress: UserChallengeProgress[];
  points: number;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  stamp_count: number;
}
