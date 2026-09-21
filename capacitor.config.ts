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
      // Android 15+ impose l'edge-to-edge (l'ancien mode "réservé" n'est plus
      // honoré à partir du SDK 36) : la webview passe sous les barres système,
      // et le CSS gère les marges via env(safe-area-inset-*) (déjà en place
      // dans AppLayout/MobileTabBar/etc.).
      overlaysWebView: true,
      style: 'DARK', // icônes sombres (adapté à un fond clair sous la barre)
      backgroundColor: '#00000000',
    },
  },
};

export default config;
