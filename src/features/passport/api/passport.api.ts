import { apiClient } from '../../../shared/api/client';
import type { Badge, Challenge, LeaderboardEntry, Passport } from '../types';

export async function fetchMyPassport(): Promise<Passport> {
  const { data } = await apiClient.get<Passport>('/passport/me');
  return data;
}

export async function fetchBadges(): Promise<Badge[]> {
  const { data } = await apiClient.get<Badge[]>('/passport/badges');
  return data;
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const { data } = await apiClient.get<Challenge[]>('/passport/challenges');
  return data;
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data } = await apiClient.get<LeaderboardEntry[]>('/passport/leaderboard', { params: { limit } });
  return data;
}
