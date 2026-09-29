import { apiClient } from './client';
import { env } from '../config/env';

export interface AwardPhoto {
  id: string;
  edition: number | null;
  url: string;
}

// Photos embarquées dans l'appli (public/awards) : affichées même si l'API
// n'en renvoie aucune ou est injoignable.
const BUNDLED_IDS = [
  '2026-a-laureats',
  '2026-b-trophee',
  '2026-c-attestation',
  '2026-d-ceremonie',
  '2026-e-salon',
  '2026-f-stand',
];

const bundled = (): AwardPhoto[] =>
  BUNDLED_IDS.map((id) => ({
    id,
    edition: Number(id.slice(0, 4)),
    url: `${import.meta.env.BASE_URL}awards/${id}.webp`,
  }));

export async function fetchAwards(): Promise<AwardPhoto[]> {
  try {
    const { data } = await apiClient.get<{ items: AwardPhoto[] }>('/awards');
    if (data.items.length > 0) {
      // Les images sont servies à la racine du serveur (/uploads), pas sous /api/v1.
      const origin = env.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
      return data.items.map((p) => ({ ...p, url: `${origin}${p.url}` }));
    }
  } catch {
    // on retombe sur les photos embarquées
  }
  return bundled();
}
