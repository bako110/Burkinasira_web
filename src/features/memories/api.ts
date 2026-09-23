import { apiClient } from '../../shared/api/client';
import type { CreateMemoryPayload, Memory, MemoryListResponse, MemoryTargetType } from './types';

/** Laisser un souvenir (photo/vidéo) public — aucune réservation requise. */
export async function createMemory(payload: CreateMemoryPayload): Promise<Memory> {
  const { data } = await apiClient.post<Memory>('/memories', payload);
  return data;
}

/** Souvenirs publiés d'une cible (destination, hôtel, resto, guide, transport, événement...). */
export async function fetchMemoriesForTarget(
  targetType: MemoryTargetType,
  targetId: string,
  page = 1,
  pageSize = 24,
): Promise<MemoryListResponse> {
  const { data } = await apiClient.get<MemoryListResponse>(
    `/memories/target/${targetType}/${targetId}`,
    { params: { page, page_size: pageSize } },
  );
  return data;
}

export async function deleteMemory(memoryId: string): Promise<void> {
  await apiClient.delete(`/memories/${memoryId}`);
}
