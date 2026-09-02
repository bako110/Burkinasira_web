import { useTranslation } from 'react-i18next';
import { LocateFixed, Loader2, X } from 'lucide-react';
import clsx from 'clsx';

import type { useNearMe } from '../hooks/useNearMe';
import styles from './NearMeToggle.module.css';

interface NearMeToggleProps {
  nearMe: ReturnType<typeof useNearMe>;
  /** Nombre de résultats actuellement affichés — pour le libellé « élargir ». */
  resultCount?: number;
}

/**
 * Bouton « Près de moi » réutilisable sur les pages listes. Gère l'activation,
 * l'affichage du rayon courant, l'élargissement manuel et les états d'erreur
 * de géolocalisation.
 */
export function NearMeToggle({ nearMe, resultCount }: NearMeToggleProps) {
  const { t } = useTranslation();
  const { enabled, status, radiusKm, enable, disable, widen, canWiden } = nearMe;

  const isBusy = status === 'prompting';

  if (!enabled) {
    return (
      <div className={styles.wrap}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => void enable()}
          disabled={isBusy}
          aria-pressed={false}
        >
          {isBusy ? (
            <Loader2 size={15} strokeWidth={2} className={styles.spin} />
          ) : (
            <LocateFixed size={15} strokeWidth={2} />
          )}
          {t('nearMe.enable')}
        </button>

        {status === 'denied' && (
          <p className={styles.hint}>{t('nearMe.denied')}</p>
        )}
        {status === 'unavailable' && (
          <p className={styles.hint}>{t('nearMe.unavailable')}</p>
        )}
        {status === 'insecure' && (
          <p className={styles.hint}>{t('nearMe.insecure')}</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.activeRow}>
        <span className={clsx(styles.trigger, styles.triggerActive)}>
          <LocateFixed size={15} strokeWidth={2} />
          {t('nearMe.active', { radius: radiusKm })}
        </span>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={disable}
          aria-label={t('nearMe.disable')}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {typeof resultCount === 'number' && resultCount < 5 && canWiden && (
        <button type="button" className={styles.widenBtn} onClick={widen}>
          {t('nearMe.widen', { count: resultCount })}
        </button>
      )}
    </div>
  );
}
