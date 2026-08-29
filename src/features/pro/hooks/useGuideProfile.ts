import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyGuideProfile, createMyGuideProfile, updateMyGuideProfile } from '../api/guideProfile.api';

export function useMyGuideProfile() {
  return useQuery({
    queryKey: ['my-guide-profile'],
    queryFn: fetchMyGuideProfile,
  });
}

export function useCreateMyGuideProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyGuideProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-profile'] }),
  });
}

export function useUpdateMyGuideProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyGuideProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-profile'] }),
  });
}
