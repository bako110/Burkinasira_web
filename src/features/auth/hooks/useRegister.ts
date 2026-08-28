import { useMutation } from '@tanstack/react-query';

import { register } from '../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
    },
  });
}
