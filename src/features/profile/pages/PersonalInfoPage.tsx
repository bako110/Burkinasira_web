import { type FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, User } from 'lucide-react';

import { Card, Input, Button, Spinner, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import styles from './ProfileSubPage.module.css';

export function PersonalInfoPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfile, isPending, isSuccess, error } = useUpdateProfile();
  const uploadMedia = useUploadMedia();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');

  const isUploadingPhoto = uploadMedia.isPending;

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (media) => {
        setAvatarUrl(media.url);
        updateProfile({ avatar_url: media.url });
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

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
        <div className={styles.photoRow}>
          <div className={styles.photoPreview}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" />
            ) : (
              <User size={28} strokeWidth={1.5} />
            )}
          </div>
          <button
            type="button"
            className={styles.photoButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
          >
            {isUploadingPhoto ? <Spinner size={16} /> : <Upload size={16} strokeWidth={2} />}
            {t('profile.uploadPhoto')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handlePhotoChange}
          />
        </div>

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
