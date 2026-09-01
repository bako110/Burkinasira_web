import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.burkinasira.app',
  appName: 'BurkinaSira',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      // La webview ne passe PAS sous la barre de statut : Android réserve l'espace.
      overlaysWebView: false,
      style: 'DARK', // icônes sombres (barre claire)
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
