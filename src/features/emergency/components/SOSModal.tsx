import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Siren, MapPin, CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useTriggerSOS } from '../hooks/useTriggerSOS';
import type { SOSAlertResult } from '../types';
import styles from './SOSModal.module.css';

interface SOSModalProps {
  open: boolean;
  onClose: () => void;
}

export function SOSModal({ open, onClose }: SOSModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useTriggerSOS();
  const [trustedPhone, setTrustedPhone] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<SOSAlertResult | null>(null);
  const [locationError, setLocationError] = useState(false);

  function handleClose() {
    setResult(null);
    setLocationError(false);
    onClose();
  }

  function handleTrigger() {
    setLocationError(false);
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mutate(
          {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            trusted_contact_phone: trustedPhone || undefined,
            message: message || undefined,
          },
          {
            onSuccess: (data) => {
              setResult(data);
              push({ variant: 'success', message: t('emergency.sosSuccess') });
            },
            onError: (err) => {
              push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
            },
          },
        );
      },
      () => setLocationError(true),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('emergency.sosTitle')}>
      {result ? (
        <div className={styles.successContent}>
          <span className={styles.successIcon}>
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </span>
          <p className={styles.successText}>{t('emergency.sosSentText')}</p>
          <div className={styles.contactsList}>
            {result.emergency_contacts.map((c) => (
              <a key={c.id} href={`tel:${c.phone_number}`} className={styles.contactRow}>
                <span>{c.label}</span>
                <span>{c.phone_number}</span>
              </a>
            ))}
          </div>
          <Button fullWidth onClick={handleClose}>
            {t('common.close')}
          </Button>
        </div>
      ) : (
        <div className={styles.content}>
          <span className={styles.icon}>
            <Siren size={28} strokeWidth={1.75} />
          </span>
          <p className={styles.text}>{t('emergency.sosText')}</p>

          <Input
            label={t('emergency.trustedContact')}
            name="trusted-contact"
            type="tel"
            value={trustedPhone}
            onChange={(e) => setTrustedPhone(e.target.value)}
            placeholder="+226 70 00 00 00"
          />
          <Input
            label={t('emergency.sosMessage')}
            name="sos-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('emergency.sosMessagePlaceholder')}
          />

          {locationError && <p className={styles.locationError}>{t('emergency.locationError')}</p>}
          {error && !locationError && (
            <p className={styles.locationError}>{extractApiErrorMessage(error, t('common.error'))}</p>
          )}

          <Button variant="danger" fullWidth onClick={handleTrigger} disabled={isPending}>
            {isPending ? (
              <Spinner size={18} />
            ) : (
              <>
                <MapPin size={16} strokeWidth={2} />
                {t('emergency.sosTrigger')}
              </>
            )}
          </Button>
        </div>
      )}
    </Modal>
  );
}
