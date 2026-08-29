import type { UserPublic } from '../../../shared/api/types';

export function getPostLoginPath(user: UserPublic, fallback: string): string {
  if (user.role === 'guide' || user.role === 'provider') {
    return user.is_verified ? `/pro/${user.role}` : '/pro/pending';
  }
  return fallback;
}
