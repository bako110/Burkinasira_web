import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import type { ArtisanSummary } from '../../market/types';
import { useCreateMyArtisanProfile, useUpdateMyArtisanProfile } from '../hooks/useMyEstablishments';
import { MediaGalleryInput } from './MediaGalleryInput';
import formStyles from './GuideProfileForm.module.css';

interface ArtisanProfileFormProps {
  profile?: ArtisanSummary;
  onSaved: () => void;
}

export function ArtisanProfileForm({ profile, onSaved }: ArtisanProfileFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createProfile = useCreateMyArtisanProfile();
  const updateProfile = useUpdateMyArtisanProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [story, setStory] = useState(profile?.story ?? '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? '');
  const [photos, setPhotos] = useState<string[]>(profile?.photos ?? []);
  const [videos, setVideos] = useState<string[]>(profile?.videos ?? []);
  const [region, setRegion] = useState(profile?.region ?? BURKINA_REGIONS[0]);
  const [province, setProvince] = useState(profile?.province ?? '');
  const [city, setCity] = useState(profile?.city ?? '');

  const isSaving = createProfile.isPending || updateProfile.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      display_name: displayName,
      story: story || undefined,
      photo_url: photoUrl || undefined,
      photos,
      videos,
      region,
      province: province || undefined,
      city: city || undefined,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (profile) {
      updateProfile.mutate(payload, onSettled);
    } else {
      createProfile.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="artisan_display_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="artisan_display_name"
          className={formStyles.input}
          required
          minLength={2}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="artisan_story" className={formStyles.label}>
          {t('pro.storyLabel')}
        </label>
        <textarea
          id="artisan_story"
          className={formStyles.textarea}
          rows={3}
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="artisan_photo_url" className={formStyles.label}>
          {t('pro.photoUrl', 'Photo (URL)')}
        </label>
        <input
          id="artisan_photo_url"
          className={formStyles.input}
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>

      <MediaGalleryInput
        label={t('pro.photosAndVideos')}
        photos={photos}
        videos={videos}
        onPhotosChange={setPhotos}
        onVideosChange={setVideos}
      />

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="artisan_region" className={formStyles.label}>
            {t('pro.region')}
          </label>
          <select
            id="artisan_region"
            className={formStyles.select}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {BURKINA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.field}>
          <label htmlFor="artisan_province" className={formStyles.label}>
            {t('pro.province')}
          </label>
          <input
            id="artisan_province"
            className={formStyles.input}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="artisan_city" className={formStyles.label}>
          {t('pro.city')}
        </label>
        <input id="artisan_city" className={formStyles.input} value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      <Button type="submit" fullWidth disabled={isSaving}>
        {isSaving ? <Spinner size={18} /> : t('pro.save')}
      </Button>
    </form>
  );
}
