import { create } from 'zustand';
import { Capacitor } from '@capacitor/core';

export interface Coords {
  latitude: number;
  longitude: number;
  /** Précision horizontale en mètres, si connue. */
  accuracy?: number;
}

export type GeoStatus =
  | 'idle' // jamais demandé
  | 'prompting' // demande de permission / acquisition en cours
  | 'granted' // position obtenue
  | 'denied' // permission refusée par l'utilisateur
  | 'services-off' // GPS/localisation désactivé au niveau système (pas un refus de permission)
  | 'unavailable' // pas de capteur / erreur matérielle / timeout
  | 'insecure'; // contexte non sécurisé (http) : l'API navigateur est bloquée

interface GeoState {
  coords: Coords | null;
  status: GeoStatus;
  /** Horodatage (ms) de la dernière position obtenue. */
  fetchedAt: number | null;
  error: string | null;
  /**
   * Demande la position. Réutilise une position récente (< maxAgeMs) sans
   * redéclencher le capteur. Renvoie les coords ou null.
   */
  requestLocation: (opts?: { maxAgeMs?: number; force?: boolean }) => Promise<Coords | null>;
  /** Efface la position (l'utilisateur désactive « Près de moi »). */
  clear: () => void;
}

const DEFAULT_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

async function readPosition(): Promise<Coords> {
  // Sur plateforme native (Android/iOS), on passe par le plugin Capacitor :
  // permissions natives propres, meilleure fiabilité en arrière-plan WebView.
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    const perm = await Geolocation.checkPermissions();
    if (perm.location !== 'granted') {
      const req = await Geolocation.requestPermissions();
      if (req.location !== 'granted') {
        const err = new Error('permission-denied');
        err.name = 'GeoPermissionError';
        throw err;
      }
    }
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
  }

  // Web : API standard du navigateur.
  if (!('geolocation' in navigator)) {
    const err = new Error('unavailable');
    err.name = 'GeoUnavailableError';
    throw err;
  }
  // L'API n'est disponible qu'en contexte sécurisé (https ou localhost).
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    const err = new Error('insecure-context');
    err.name = 'GeoInsecureError';
    throw err;
  }

  return new Promise<Coords>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });
}

function mapError(err: unknown): GeoStatus {
  if (err && typeof err === 'object') {
    const name = (err as { name?: string }).name;
    const code = (err as GeolocationPositionError).code;
    const message = (err as { message?: string }).message ?? '';
    if (name === 'GeoPermissionError' || code === 1) return 'denied';
    if (name === 'GeoInsecureError') return 'insecure';
    // Le plugin natif Capacitor distingue "permission refusée" (OS-PLUG-GLOC-0003)
    // de "GPS/localisation éteint au niveau système" (OS-PLUG-GLOC-0007 et 0017) :
    // ce n'est pas un refus de l'utilisateur dans l'app, mais un réglage système.
    if (/location services are not enabled|network and location turned off/i.test(message)) {
      return 'services-off';
    }
    // code 2 = position unavailable, code 3 = timeout
  }
  return 'unavailable';
}

export const useGeoStore = create<GeoState>((set, get) => ({
  coords: null,
  status: 'idle',
  fetchedAt: null,
  error: null,

  requestLocation: async (opts) => {
    const maxAge = opts?.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
    const { coords, fetchedAt, status } = get();

    if (
      !opts?.force &&
      coords &&
      fetchedAt &&
      Date.now() - fetchedAt < maxAge &&
      status === 'granted'
    ) {
      return coords;
    }

    set({ status: 'prompting', error: null });
    try {
      const next = await readPosition();
      set({ coords: next, status: 'granted', fetchedAt: Date.now(), error: null });
      return next;
    } catch (err) {
      const status = mapError(err);
      set({
        status,
        error:
          status === 'denied'
            ? 'permission-denied'
            : status === 'insecure'
              ? 'insecure-context'
              : status === 'services-off'
                ? 'services-off'
                : 'unavailable',
      });
      return null;
    }
  },

  clear: () => set({ coords: null, status: 'idle', fetchedAt: null, error: null }),
}));
