import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

import { Button } from '../../../shared/ui';
import styles from './BookingModal.module.css';

/**
 * Contenu affiché dans les modales de réservation quand RESERVATIONS_ENABLED
 * est à false : on informe l'utilisateur sans jamais lancer d'appel serveur.
 */
export function BookingUnavailable({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className={styles.success}>
      <span className={styles.unavailableIcon}>
        <AlertTriangle size={36} strokeWidth={1.5} />
      </span>
      <p className={styles.successTitle}>{t('bookings.temporarilyUnavailable')}</p>
      <Button fullWidth onClick={onClose}>
        {t('common.back')}
      </Button>
    </div>
  );
}
