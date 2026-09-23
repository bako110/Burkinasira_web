import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMemory, deleteMemory, fetchMemoriesForTarget } from './api';
import type { CreateMemoryPayload, Memory, MemoryTargetType } from './types';

export function useMemoriesForTarget(targetType: MemoryTargetType, targetId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['memories', 'target', targetType, targetId, page],
    queryFn: () => fetchMemoriesForTarget(targetType, targetId as string, page),
    enabled: Boolean(targetId),
  });
}

/**
 * Accumule les pages de souvenirs au fil du scroll infini (galerie complète,
 * page dédiée). Se réinitialise dès que la cible change.
 */
export function useMemoriesInfinite(targetType: MemoryTargetType, targetId: string | undefined) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Memory[]>([]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['memories', 'target', targetType, targetId, page],
    queryFn: () => fetchMemoriesForTarget(targetType, targetId as string, page),
    enabled: Boolean(targetId),
  });

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [targetType, targetId]);

  useEffect(() => {
    if (!data) return;
    setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  const total = data?.total ?? 0;
  const hasMore = items.length > 0 && items.length < total;
  const isInitialLoading = isLoading && page === 1;

  function loadMore() {
    if (!isFetching && hasMore) setPage((p) => p + 1);
  }

  return { items, total, hasMore, isInitialLoading, isFetchingMore: isFetching && page > 1, isError, loadMore };
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMemoryPayload) => createMemory(payload),
    onSuccess: (memory) => {
      queryClient.invalidateQueries({ queryKey: ['memories', 'target', memory.target_type, memory.target_id] });
    },
  });
}

export function useDeleteMemory(targetType: MemoryTargetType, targetId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memoryId: string) => deleteMemory(memoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories', 'target', targetType, targetId] });
    },
  });
}
