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

/**
 * URL de redirection OAuth stable pour le flux web.
 *
 * Sur le web le plugin ouvre une popup vers Google puis Google renvoie vers ce
 * `redirect_uri` avec le `id_token` dans le hash. Le module `oauth-popup-redirect`
 * du plugin (exécuté à l'import) termine alors le flux et ferme la popup. On fixe
 * une URL fixe (`<origin>/`) plutôt que de laisser le plugin utiliser l'URL
 * courante — ainsi une seule URL est à déclarer dans Google Cloud Console, quelle
 * que soit la page depuis laquelle l'utilisateur clique.
 *
 * Cette URL DOIT figurer à l'identique dans "Authorized redirect URIs" du client
 * OAuth "Web" (Google Cloud Console). En dev : http://localhost:5173/
 */
export const googleRedirectUrl = (): string =>
  typeof window !== 'undefined' ? `${window.location.origin}/` : '';

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
        redirectUrl: googleRedirectUrl(),
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
