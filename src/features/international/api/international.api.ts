import { apiClient } from '../../../shared/api/client';
import type { FirstVisitGuideCategory, GuideEntry } from '../types';

export async function fetchGuideEntries(
  language: string,
  category?: FirstVisitGuideCategory,
): Promise<GuideEntry[]> {
  const { data } = await apiClient.get<GuideEntry[]>('/international/first-visit-guide', {
    params: { language, category },
  });
  return data;
}
