import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';

import { useToastStore } from '../store/toast.store';

const EXIT_ROOT_PATHS = ['/', '/community', '/bookings', '/messages', '/profile'];
const DOUBLE_PRESS_WINDOW_MS = 2000;

/**
 * Reproduit le comportement "appuyez encore pour quitter" (Facebook, etc.) sur le
 * bouton retour materiel Android : sur un ecran racine (onglets du bas), un premier
 * appui affiche un toast d'avertissement, un second appui dans les 2s ferme l'app.
 * Sur les autres ecrans, le bouton retour materiel navigue normalement dans l'historique.
 *
 * @param onBeforeBack Optionnel : appele avant toute autre logique. Si elle retourne
 * `true`, l'appui est considere comme consomme (ex : fermer un tiroir/modal ouvert)
 * et ni la navigation ni la confirmation de sortie ne se declenchent.
 */
export function useAndroidBackButton(onBeforeBack?: () => boolean) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const push = useToastStore((s) => s.push);
  const lastBackPressRef = useRef(0);
  const locationRef = useRef(location);
  const canGoBackRef = useRef(false);
  const onBeforeBackRef = useRef(onBeforeBack);

  locationRef.current = location;
  onBeforeBackRef.current = onBeforeBack;

  useEffect(() => {
    if (navigationType === 'PUSH') canGoBackRef.current = true;
  }, [navigationType]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: { remove: () => void } | undefined;
    let cancelled = false;

    import('@capacitor/app').then(({ App }) => {
      if (cancelled) return;
      App.addListener('backButton', () => {
        if (onBeforeBackRef.current?.()) return;

        const isRootScreen = EXIT_ROOT_PATHS.includes(locationRef.current.pathname);

        if (!isRootScreen && canGoBackRef.current) {
          navigate(-1);
          return;
        }

        const now = Date.now();
        if (now - lastBackPressRef.current < DOUBLE_PRESS_WINDOW_MS) {
          App.exitApp();
          return;
        }
        lastBackPressRef.current = now;
        push({ variant: 'info', message: t('common.pressBackAgainToExit') });
      }).then((handle) => {
        listenerHandle = handle;
      });
    }).catch(() => {
      // plugin @capacitor/app absent : le bouton retour garde le comportement par defaut
    });

    return () => {
      cancelled = true;
      listenerHandle?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
