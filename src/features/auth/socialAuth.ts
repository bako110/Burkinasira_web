import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';

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
 * OAuth "Web" (Google Cloud Console) — sans slash final, Google Cloud refusant
 * `http://localhost:5173/`. En dev : http://localhost:5173
 */
export const googleRedirectUrl = (): string =>
  typeof window !== 'undefined' ? window.location.origin : '';

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

function extractIdToken(res: { result: unknown }): string {
  const result = res.result as { idToken?: string | null };
  const idToken = result?.idToken;
  if (!idToken) throw new Error('google-no-id-token');
  return idToken;
}

/** L'écran plein écran "Sign in with Google" (lent, mais marche sans compte pré-autorisé). */
async function loginStandard(): Promise<string> {
  const res = await SocialLogin.login({ provider: 'google', options: {} });
  return extractIdToken(res);
}

/**
 * Lance le flux Google et renvoie le `id_token` JWT à vérifier côté backend.
 *
 * Android : on tente d'abord la **bottom-sheet** (`style: 'bottom'`,
 * `filterByAuthorizedAccounts: false`) — elle affiche instantanément les comptes
 * déjà présents sur le téléphone, sans plein écran ni chargement blanc. Si elle
 * échoue faute de compte utilisable (`GetCredentialException` "no credential"),
 * on retombe sur l'écran standard plein écran.
 *
 * Ne PAS passer `scopes` : le plugin ajoute déjà `email`/`profile`/`openid` par
 * défaut, et fournir des scopes explicites exigerait une MainActivity modifiée.
 */
export async function signInWithGoogle(): Promise<string> {
  await ensureInitialized();

  if (!Capacitor.isNativePlatform()) {
    return loginStandard();
  }

  try {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        style: 'bottom',
        filterByAuthorizedAccounts: false,
        autoSelectEnabled: false,
      },
    });
    return extractIdToken(res);
  } catch (err) {
    const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
    const isUserCancel =
      msg.includes('cancel') || msg.includes('dismiss') || msg.includes('closed by the user');
    if (isUserCancel) throw err;
    // Pas de compte sélectionnable pour la bottom-sheet -> plein écran.
    const noCredential =
      msg.includes('no credential') ||
      msg.includes('no credentials') ||
      msg.includes('activity is cancelled') ||
      msg.includes('type_no_credential');
    if (noCredential) {
      return loginStandard();
    }
    throw err;
  }
}
