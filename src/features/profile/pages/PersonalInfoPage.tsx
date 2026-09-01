import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Input, Button, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import styles from './ProfileSubPage.module.css';

export function PersonalInfoPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { mutate: updateProfile, isPending, isSuccess, error } = useUpdateProfile();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile({ full_name: fullName, phone: phone || undefined });
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('profile.editTitle')}</h1>

      <Card className={styles.section}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('auth.fullName')}
            name="profile-full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label={t('auth.phone')}
            name="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}
          {isSuccess && <p className={styles.success}>{t('profile.saved')}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
