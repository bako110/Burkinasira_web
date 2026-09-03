import { useMutation } from '@tanstack/react-query';

import { loginWithGoogle } from '../api/auth.api';
import { signInWithGoogle } from '../socialAuth';
import { useAuthStore } from '../../../store/auth.store';

/**
 * Flux complet "Continuer avec Google" :
 *   1. `signInWithGoogle()` -> id_token (via le plugin natif / GIS web)
 *   2. `POST /auth/google` -> access token BurkinaSira + user
 *   3. ouverture de session
 */
export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async () => {
      const idToken = await signInWithGoogle();
      return loginWithGoogle(idToken);
    },
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
    },
  });
}
