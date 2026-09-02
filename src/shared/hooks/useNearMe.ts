import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGeoStore, type Coords } from '../../store/geo.store';

/** Paliers de rayon (km) essayés successivement tant qu'il y a trop peu de résultats. */
export const RADIUS_STEPS_KM = [5, 10, 25, 50] as const;

/** En dessous de ce nombre de résultats, on élargit automatiquement le rayon. */
export const WIDEN_THRESHOLD = 5;

interface UseNearMeOptions {
  /**
   * Clé qui identifie les autres filtres de la page (catégorie, région, texte…).
   * Quand elle change, le rayon repart au premier palier. Passer une chaîne
   * stable, ex : `${category}|${region}`.
   */
  filtersKey?: string;
}

interface UseNearMeResult {
  enabled: boolean;
  coords: Coords | null;
  /** Rayon courant en km, ou null si « Près de moi » est inactif. */
  radiusKm: number | null;
  status: ReturnType<typeof useGeoStore.getState>['status'];
  enable: () => Promise<void>;
  disable: () => void;
  widen: () => void;
  canWiden: boolean;
  /**
   * La page transmet ici le résultat de SA requête « Près de moi » :
   *   - `resultCount` : total renvoyé par l'API
   *   - `isFetching`  : une requête est encore en vol
   *   - `forRadiusKm` : le rayon avec lequel cette réponse a été obtenue
   * L'élargissement automatique ne se déclenche que si `forRadiusKm` correspond
   * au rayon courant : cela évite d'agir sur une réponse périmée (course entre
   * l'état React et le réseau) et donc toute cascade de requêtes.
   */
  reportResult: (args: {
    resultCount: number | undefined;
    isFetching: boolean;
    forRadiusKm: number | null;
  }) => void;
}

/**
 * État « Près de moi » d'une page liste : acquisition de position (partagée via
 * le store) + rayon adaptatif qui s'élargit d'un seul palier à la fois, une
 * seule fois par palier, uniquement sur une réponse à jour.
 */
export function useNearMe(options: UseNearMeOptions = {}): UseNearMeResult {
  const { filtersKey } = options;

  const coords = useGeoStore((s) => s.coords);
  const status = useGeoStore((s) => s.status);
  const requestLocation = useGeoStore((s) => s.requestLocation);

  const [enabled, setEnabled] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const currentRadius = enabled ? RADIUS_STEPS_KM[stepIndex] : null;

  // Dernier rapport transmis par la page (écrit en render, lu dans un effet).
  const report = useRef<{
    resultCount: number | undefined;
    isFetching: boolean;
    forRadiusKm: number | null;
  }>({ resultCount: undefined, isFetching: false, forRadiusKm: null });
  // Palier déjà jugé : on n'élargit jamais deux fois pour le même rayon.
  const judgedRadius = useRef<number | null>(null);
  // Réveille l'effet d'évaluation quand un nouveau rapport arrive.
  const [tick, setTick] = useState(0);

  const reportResult = useCallback(
    (args: { resultCount: number | undefined; isFetching: boolean; forRadiusKm: number | null }) => {
      const prev = report.current;
      if (
        prev.resultCount === args.resultCount &&
        prev.isFetching === args.isFetching &&
        prev.forRadiusKm === args.forRadiusKm
      ) {
        return;
      }
      report.current = args;
      setTick((n) => n + 1);
    },
    [],
  );

  // Évaluation de l'élargissement automatique.
  useEffect(() => {
    if (!enabled || currentRadius === null) return;
    const { resultCount, isFetching, forRadiusKm } = report.current;
    if (isFetching || resultCount === undefined) return;
    // La réponse doit correspondre au rayon actuellement demandé.
    if (forRadiusKm !== currentRadius) return;
    // Ce rayon a déjà été jugé.
    if (judgedRadius.current === currentRadius) return;
    judgedRadius.current = currentRadius;

    if (resultCount < WIDEN_THRESHOLD && stepIndex < RADIUS_STEPS_KM.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [tick, enabled, currentRadius, stepIndex]);

  // Changement des autres filtres → on repart du premier palier.
  const prevKey = useRef(filtersKey);
  useEffect(() => {
    if (prevKey.current !== filtersKey) {
      prevKey.current = filtersKey;
      if (enabled) {
        judgedRadius.current = null;
        setStepIndex(0);
      }
    }
  }, [filtersKey, enabled]);

  // Position perdue (permission révoquée) → on coupe proprement.
  useEffect(() => {
    if (enabled && !coords && status !== 'prompting') {
      judgedRadius.current = null;
      setEnabled(false);
      setStepIndex(0);
    }
  }, [enabled, coords, status]);

  const enable = useCallback(async () => {
    const pos = await requestLocation();
    if (pos) {
      judgedRadius.current = null;
      setStepIndex(0);
      setEnabled(true);
    }
  }, [requestLocation]);

  const disable = useCallback(() => {
    judgedRadius.current = null;
    setEnabled((v) => (v ? false : v));
    setStepIndex((i) => (i ? 0 : i));
  }, []);

  const widen = useCallback(() => {
    setStepIndex((i) => (i < RADIUS_STEPS_KM.length - 1 ? i + 1 : i));
  }, []);

  return useMemo(
    () => ({
      enabled,
      coords: enabled ? coords : null,
      radiusKm: currentRadius,
      status,
      enable,
      disable,
      widen,
      canWiden: stepIndex < RADIUS_STEPS_KM.length - 1,
      reportResult,
    }),
    [enabled, coords, currentRadius, stepIndex, status, enable, disable, widen, reportResult],
  );
}
