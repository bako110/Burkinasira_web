import { Capacitor } from '@capacitor/core';

/**
 * Initialisation spécifique à l'app native (Capacitor).
 * Sur le web, cette fonction ne fait rien.
 */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // La webview ne passe pas sous la barre de statut : Android réserve l'espace.
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light }); // icônes sombres sur fond clair
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  } catch {
    // plugin absent ou plateforme non supportée : on ignore
  }
}
