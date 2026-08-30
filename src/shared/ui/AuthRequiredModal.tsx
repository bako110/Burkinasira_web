import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal } from './Modal';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

interface AuthRequiredModalProps {
  open: boolean;
  from: string;
}

export function AuthRequiredModal({ open, from }: AuthRequiredModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={() => navigate('/')} title={t('auth.requiredTitle')}>
      <p className={styles.message}>{t('auth.requiredMessage')}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate('/')} fullWidth>
          {t('auth.goHome')}
        </Button>
        <Button variant="primary" onClick={() => navigate('/login', { state: { from } })} fullWidth>
          {t('auth.loginCta')}
        </Button>
      </div>
    </Modal>
  );
}
