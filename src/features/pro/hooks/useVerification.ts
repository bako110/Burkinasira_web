import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyVerificationRequests, submitVerificationRequest } from '../api/verification.api';

export function useMyVerificationRequests() {
  return useQuery({
    queryKey: ['my-verification-requests'],
    queryFn: fetchMyVerificationRequests,
  });
}

export function useSubmitVerificationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitVerificationRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-verification-requests'] }),
  });
}
