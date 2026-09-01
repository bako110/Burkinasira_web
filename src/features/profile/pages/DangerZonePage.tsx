import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

import { Card, Button, DetailBackButton } from '../../../shared/ui';
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
      <h1 className={styles.title}>{t('profile.dangerZone')}</h1>

      <Card className={styles.dangerSection}>
        <p className={styles.dangerText}>{t('profile.deleteAccountText')}</p>
        <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={15} strokeWidth={2} />
          {t('profile.deleteAccount')}
        </Button>
      </Card>

      <DeleteAccountDialog
        open={deleteOpen}
        isPending={isDeleting}
        onConfirm={handleDeleteAccount}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
