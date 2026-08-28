import { useMutation } from '@tanstack/react-query';

import { deleteAccount } from '../api/profile.api';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}
