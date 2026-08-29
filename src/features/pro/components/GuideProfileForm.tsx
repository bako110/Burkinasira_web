import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageOff, Upload, AlertTriangle, Clock } from 'lucide-react';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import { useCreateMyGuideProfile, useMyGuideProfile, useUpdateMyGuideProfile } from '../hooks/useGuideProfile';
import styles from './GuideProfileForm.module.css';

interface GuideProfileFormProps {
  onSaved?: () => void;
}

export function GuideProfileForm({ onSaved }: GuideProfileFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useMyGuideProfile();
  const uploadMedia = useUploadMedia();
  const createProfile = useCreateMyGuideProfile();
  const updateProfile = useUpdateMyGuideProfile();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [languages, setLanguages] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[0]);
  const [dailyRate, setDailyRate] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name);
    setBio(profile.bio ?? '');
    setPhotoUrl(profile.photo_url ?? '');
    setLanguages(profile.languages.join(', '));
    setSpecialties(profile.specialties.join(', '));
    setRegion(profile.regions_covered[0] ?? BURKINA_REGIONS[0]);
    setDailyRate(profile.daily_rate !== undefined ? String(profile.daily_rate) : '');
    setHourlyRate(profile.hourly_rate !== undefined ? String(profile.hourly_rate) : '');
  }, [profile]);

  const isSaving = createProfile.isPending || updateProfile.isPending;
  const isUploadingPhoto = uploadMedia.isPending;

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (media) => setPhotoUrl(media.url),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      display_name: displayName,
      bio: bio || undefined,
      photo_url: photoUrl || undefined,
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
      regions_covered: [region],
      hourly_rate: hourlyRate ? Number(hourlyRate) : undefined,
      daily_rate: dailyRate ? Number(dailyRate) : undefined,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.profileSaved') });
        onSaved?.();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (profile) {
      updateProfile.mutate(payload, onSettled);
    } else {
      createProfile.mutate(payload, onSettled);
    }
  }

  if (isLoading) {
    return <Spinner size={24} />;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {profile?.status === 'pending' && !profile.rejection_reason && (
        <div className={`${styles.statusBanner} ${styles.statusPending}`}>
          <Clock size={16} strokeWidth={2} />
          {t('pro.profileUnderReview')}
        </div>
      )}

      {profile?.rejection_reason && (
        <div className={`${styles.statusBanner} ${styles.statusRejected}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} strokeWidth={2} />
            {t('pro.profileRejected')}
          </span>
          <span className={styles.rejectionReason}>{profile.rejection_reason}</span>
        </div>
      )}

      <div className={styles.photoRow}>
        <div className={styles.photoPreview}>
          {photoUrl ? <img src={photoUrl} alt="" /> : <ImageOff size={22} strokeWidth={1.5} />}
        </div>
        <button
          type="button"
          className={styles.photoButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingPhoto}
        >
          {isUploadingPhoto ? <Spinner size={16} /> : <Upload size={16} strokeWidth={2} />}
          {t('pro.uploadPhoto')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handlePhotoChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="display_name" className={styles.label}>
          {t('pro.displayName')}
        </label>
        <input
          id="display_name"
          className={styles.input}
          required
          minLength={2}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="bio" className={styles.label}>
          {t('pro.bio')}
        </label>
        <textarea
          id="bio"
          className={styles.textarea}
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="languages" className={styles.label}>
            {t('pro.languages')}
          </label>
          <input
            id="languages"
            className={styles.input}
            placeholder={t('pro.languagesPlaceholder')}
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="specialties" className={styles.label}>
            {t('pro.specialties')}
          </label>
          <input
            id="specialties"
            className={styles.input}
            placeholder={t('pro.specialtiesPlaceholder')}
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="region" className={styles.label}>
          {t('pro.regionCovered')}
        </label>
        <select id="region" className={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
          {BURKINA_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="daily_rate" className={styles.label}>
            {t('pro.dailyRate')}
          </label>
          <input
            id="daily_rate"
            type="number"
            step="any"
            className={styles.input}
            value={dailyRate}
            onChange={(e) => setDailyRate(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="hourly_rate" className={styles.label}>
            {t('pro.hourlyRate')}
          </label>
          <input
            id="hourly_rate"
            type="number"
            step="any"
            className={styles.input}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" fullWidth disabled={isSaving}>
        {isSaving ? <Spinner size={18} /> : t('pro.saveProfile')}
      </Button>
    </form>
  );
}
