import { useMutation } from '@tanstack/react-query';

import { loginWithGoogle } from '../api/auth.api';
import { signInWithGoogle } from '../socialAuth';
import { useAuthStore } from '../../../store/auth.store';
import type { TokenResponse } from '../../../shared/api/types';
import type { SignupRole } from '../types';

export interface GoogleLoginResult {
  response: TokenResponse;
  /** id_token Google, conservé pour un second appel si l'on demande le rôle. */
  idToken: string;
}

/**
 * Flux "Continuer avec Google" :
 *   1. `signInWithGoogle()` -> id_token (plugin natif / GIS web)
 *   2. `POST /auth/google` (+ role optionnel) -> access token BurkinaSira
 *   3. ouverture de session
 *
 * `response.is_new === true` : compte tout juste créé -> l'appelant peut
 * envoyer l'utilisateur vers l'écran de choix du rôle, qui rappellera
 * `finalizeRole(idToken, role)`.
 */
export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<GoogleLoginResult, unknown, SignupRole | undefined>({
    mutationFn: async (role) => {
      const idToken = await signInWithGoogle();
      const response = await loginWithGoogle(idToken, role);
      return { response, idToken };
    },
    onSuccess: ({ response }) => {
      setSession(response.access_token, response.user);
    },
  });
}

/** Second appel : confirme le rôle choisi après une première connexion Google. */
export function useFinalizeGoogleRole() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<TokenResponse, unknown, { idToken: string; role: SignupRole }>({
    mutationFn: ({ idToken, role }) => loginWithGoogle(idToken, role),
    onSuccess: (response) => {
      setSession(response.access_token, response.user);
    },
  });
}
