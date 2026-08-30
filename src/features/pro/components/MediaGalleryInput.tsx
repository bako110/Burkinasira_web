import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Video, RotateCw } from 'lucide-react';
import clsx from 'clsx';

import { Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import styles from './MediaGalleryInput.module.css';

interface MediaGalleryInputProps {
  label: string;
  photos: string[];
  videos: string[];
  onPhotosChange: (photos: string[]) => void;
  onVideosChange: (videos: string[]) => void;
  maxItems?: number;
  photos360?: string[];
  onPhotos360Change?: (photos360: string[]) => void;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
}

export function MediaGalleryInput({
  label,
  photos,
  videos,
  onPhotosChange,
  onVideosChange,
  maxItems = 10,
  photos360,
  onPhotos360Change,
}: MediaGalleryInputProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tourFileInputRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useUploadMedia();
  const uploadTourMedia = useUploadMedia();

  const items = [
    ...photos.map((url) => ({ url, isVideo: false })),
    ...videos.map((url) => ({ url, isVideo: true })),
  ];
  const atLimit = items.length >= maxItems;
  const supportsTour = photos360 !== undefined && onPhotos360Change !== undefined;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (media) => {
        if (media.resource_type === 'video' || isVideoUrl(media.url)) {
          onVideosChange([...videos, media.url]);
        } else {
          onPhotosChange([...photos, media.url]);
        }
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleTourFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onPhotos360Change || !photos360) return;
    uploadTourMedia.mutate(file, {
      onSuccess: (media) => onPhotos360Change([...photos360, media.url]),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
    if (tourFileInputRef.current) tourFileInputRef.current.value = '';
  }

  function handleRemove(url: string, isVideo: boolean) {
    if (isVideo) {
      onVideosChange(videos.filter((v) => v !== url));
    } else {
      onPhotosChange(photos.filter((p) => p !== url));
    }
  }

  function handleRemoveTourMedia(url: string) {
    if (!onPhotos360Change || !photos360) return;
    onPhotos360Change(photos360.filter((p) => p !== url));
  }

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.grid}>
        {items.map(({ url, isVideo }) => (
          <div key={url} className={styles.item}>
            {isVideo ? <video src={url} muted /> : <img src={url} alt="" />}
            {isVideo && (
              <span className={styles.videoBadge}>
                <Video size={11} strokeWidth={2} />
              </span>
            )}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemove(url, isVideo)}
              aria-label={t('common.delete')}
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        ))}

        {!atLimit && (
          <button
            type="button"
            className={styles.addButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
          >
            {uploadMedia.isPending ? <Spinner size={18} /> : <Plus size={20} strokeWidth={2} />}
            {!uploadMedia.isPending && t('pro.addMedia')}
          </button>
        )}
      </div>
      <span className={styles.hint}>{t('pro.mediaHint')}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        hidden
        onChange={handleFileChange}
      />

      {supportsTour && (
        <div className={clsx(styles.field, styles.tourField)}>
          <label className={styles.label}>
            <RotateCw size={14} strokeWidth={2} />
            {t('pro.photos360Label')}
          </label>
          <div className={styles.grid}>
            {photos360!.map((url) => (
              <div key={url} className={styles.item}>
                {isVideoUrl(url) ? <video src={url} muted /> : <img src={url} alt="" />}
                <span className={styles.tourBadge}>360°</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveTourMedia(url)}
                  aria-label={t('common.delete')}
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            ))}

            {!atLimit && (
              <button
                type="button"
                className={styles.addButton}
                onClick={() => tourFileInputRef.current?.click()}
                disabled={uploadTourMedia.isPending}
              >
                {uploadTourMedia.isPending ? <Spinner size={18} /> : <RotateCw size={20} strokeWidth={2} />}
                {!uploadTourMedia.isPending && t('pro.addPhoto360')}
              </button>
            )}
          </div>
          <span className={styles.hint}>{t('pro.photos360Hint')}</span>
          <input
            ref={tourFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            hidden
            onChange={handleTourFileChange}
          />
        </div>
      )}
    </div>
  );
}
