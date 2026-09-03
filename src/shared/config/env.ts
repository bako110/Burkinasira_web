export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  appName: import.meta.env.VITE_APP_NAME ?? 'BurkinaSira',
  // ID client OAuth "Web" du projet Google Cloud. Sert pour le web ET pour
  // Android (le plugin natif l'exige comme "server client id"). Vide = bouton
  // "Continuer avec Google" masqué.
  googleWebClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? '',
} as const;
