import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertTriangle } from 'lucide-react';

import { Card, Button, DetailBackButton } from '../../../shared/ui';
import { Reveal } from '../../../shared/ui/Reveal';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { DeleteAccountDialog } from '../components/DeleteAccountDialog';
import styles from './ProfileSubPage.module.css';

export function DangerZonePage() {
  const { t } = useTranslation();
  const clearSession = useAuthStore((s) => s.clearSession);
  const push = useToastStore((s) => s.push);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleDeleteAccount() {
    deleteAccount(undefined, {
      onSuccess: () => {
        push({ variant: 'success', message: t('profile.deleteSuccess') });
        clearSession();
      },
      onError: (err) => {
        push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        setDeleteOpen(false);
      },
    });
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>

      <div className={styles.header}>
        <span className={styles.kicker}>{t('nav.profile')}</span>
        <h1 className={styles.title}>{t('profile.dangerZone')}</h1>
      </div>

      <Reveal>
        <Card className={styles.dangerSection}>
          <div className={styles.dangerHeader}>
            <span className={styles.dangerIcon}>
              <AlertTriangle size={20} strokeWidth={1.75} />
            </span>
            <h2 className={styles.dangerTitle}>{t('profile.deleteAccount')}</h2>
          </div>
          <p className={styles.dangerText}>{t('profile.deleteAccountText')}</p>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={15} strokeWidth={2} />
            {t('profile.deleteAccount')}
          </Button>
        </Card>
      </Reveal>

      <DeleteAccountDialog
        open={deleteOpen}
        isPending={isDeleting}
        onConfirm={handleDeleteAccount}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
