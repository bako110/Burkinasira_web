import { useMutation } from '@tanstack/react-query';

import { updateProfile } from '../api/profile.api';
import { useAuthStore } from '../../../store/auth.store';

export function useUpdateProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      if (accessToken) setSession(accessToken, user);
    },
  });
}
