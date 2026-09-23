import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMemory, deleteMemory, fetchMemoriesForTarget } from './api';
import type { CreateMemoryPayload, MemoryTargetType } from './types';

export function useMemoriesForTarget(targetType: MemoryTargetType, targetId: string | undefined) {
  return useQuery({
    queryKey: ['memories', 'target', targetType, targetId],
    queryFn: () => fetchMemoriesForTarget(targetType, targetId as string),
    enabled: Boolean(targetId),
  });
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
