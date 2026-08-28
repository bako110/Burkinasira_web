import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import {
  fetchMyFavoriteLists,
  createFavoriteList,
  addToFavoriteList,
  removeFromFavoriteList,
  deleteFavoriteList,
} from '../api/community.api';

export function useMyFavoriteLists() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['favorite-lists'],
    queryFn: fetchMyFavoriteLists,
    enabled: isAuthenticated,
  });
}

export function useCreateFavoriteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFavoriteList,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-lists'] }),
  });
}

export function useAddToFavoriteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, destinationId }: { listId: string; destinationId: string }) =>
      addToFavoriteList(listId, destinationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-lists'] }),
  });
}

export function useRemoveFromFavoriteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, destinationId }: { listId: string; destinationId: string }) =>
      removeFromFavoriteList(listId, destinationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-lists'] }),
  });
}

export function useDeleteFavoriteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFavoriteList,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorite-lists'] }),
  });
}
