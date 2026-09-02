import { useEffect, useRef } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';

import { useToastStore } from '../store/toast.store';

const DOUBLE_PRESS_WINDOW_MS = 2000;

/**
 * Reproduit le comportement "appuyez encore pour quitter" (Facebook, etc.) sur le
 * bouton retour materiel Android : tant qu'il reste un historique de navigation
 * interne a l'app (peu importe la page), le bouton retour navigue en arriere comme
 * d'habitude. Des qu'il n'y a plus rien a depiler (l'utilisateur est sur le tout
 * premier ecran de sa session), un premier appui affiche un toast d'avertissement,
 * et un second appui dans les 2 secondes ferme reellement l'app — sans jamais forcer
 * un retour explicite a l'accueil au prealable.
 *
 * @param onBeforeBack Optionnel : appele avant toute autre logique. Si elle retourne
 * `true`, l'appui est considere comme consomme (ex : fermer un tiroir/modal ouvert)
 * et ni la navigation ni la confirmation de sortie ne se declenchent.
 */
export function useAndroidBackButton(onBeforeBack?: () => boolean) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const push = useToastStore((s) => s.push);
  const lastBackPressRef = useRef(0);
  const historyDepthRef = useRef(0);
  const onBeforeBackRef = useRef(onBeforeBack);

  onBeforeBackRef.current = onBeforeBack;

  useEffect(() => {
    if (navigationType === 'PUSH') {
      historyDepthRef.current += 1;
    } else if (navigationType === 'POP' && historyDepthRef.current > 0) {
      historyDepthRef.current -= 1;
    }
    // REPLACE ne change pas la profondeur d'historique interne.
  }, [navigationType]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: { remove: () => void } | undefined;
    let cancelled = false;

    import('@capacitor/app').then(({ App }) => {
      if (cancelled) return;
      App.addListener('backButton', () => {
        if (onBeforeBackRef.current?.()) return;

        if (historyDepthRef.current > 0) {
          historyDepthRef.current -= 1;
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
