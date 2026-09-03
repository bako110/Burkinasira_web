import { SocialLogin } from '@capgo/capacitor-social-login';

import { env } from '../../shared/config/env';

/**
 * Connexion sociale (Google) via @capgo/capacitor-social-login.
 * - Web : ouvre le flux Google Identity Services et renvoie un id_token.
 * - Android natif : sélecteur de compte Google natif (Credential Manager).
 *
 * Le `webClientId` sert dans les deux cas (Android l'exige comme "server client id").
 * Sans lui, la connexion Google est considérée indisponible.
 */

export const isGoogleAuthConfigured = (): boolean => Boolean(env.googleWebClientId);

let initPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (!isGoogleAuthConfigured()) {
    throw new Error('google-auth-not-configured');
  }
  if (!initPromise) {
    initPromise = SocialLogin.initialize({
      google: {
        webClientId: env.googleWebClientId,
        mode: 'online',
      },
    });
  }
  await initPromise;
}

/** Lance le flux Google et renvoie le `id_token` JWT à vérifier côté backend. */
export async function signInWithGoogle(): Promise<string> {
  await ensureInitialized();

  const res = await SocialLogin.login({
    provider: 'google',
    options: { scopes: ['email', 'profile'] },
  });

  const result = res.result as { idToken?: string | null; responseType?: string };
  const idToken = result?.idToken;
  if (!idToken) {
    throw new Error('google-no-id-token');
  }
  return idToken;
}
