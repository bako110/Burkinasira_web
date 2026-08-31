import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus, X, Video, MapPin } from 'lucide-react';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreatePost } from '../hooks/useCreatePost';
import type { PostType } from '../types';
import styles from './CreatePostModal.module.css';

const POST_TYPES: PostType[] = ['recommandation', 'carnet_voyage', 'photo', 'video'];
const MAX_MEDIA = 6;

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
}

export function CreatePostModal({ open, onClose, groupId }: { open: boolean; onClose: () => void; groupId?: string }) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMedia = useUploadMedia();
  const { mutate: create, isPending: isCreating, error } = useCreatePost();

  const [type, setType] = useState<PostType>('recommandation');
  const [caption, setCaption] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [placeName, setPlaceName] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  function resetAndClose() {
    setType('recommandation');
    setCaption('');
    setMediaUrls([]);
    setPlaceName('');
    setCoords(null);
    onClose();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (result) => {
        setMediaUrls((prev) => [...prev, result.url]);
        if (result.resource_type === 'video') setType('video');
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemoveMedia(url: string) {
    setMediaUrls((prev) => prev.filter((u) => u !== url));
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        push({ variant: 'error', message: t('community.locationError') });
        setIsLocating(false);
      },
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalCaption = placeName.trim() ? `📍 ${placeName.trim()}\n${caption}` : caption;
    create(
      {
        type,
        caption: finalCaption || undefined,
        media_urls: mediaUrls,
        group_id: groupId,
        location: coords ?? undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('community.postCreated') });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  const atLimit = mediaUrls.length >= MAX_MEDIA;

  return (
    <Modal open={open} onClose={resetAndClose} title={t('community.createPostTitle')}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.label}>{t('community.postType')}</span>
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as PostType)}>
            {POST_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {t(`community.postTypes.${pt}`)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="post-caption" className={styles.label}>
            {t('community.postCaption')}
          </label>
          <textarea
            id="post-caption"
            className={styles.textarea}
            rows={3}
            required
            minLength={1}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t('community.postCaptionPlaceholder')}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>{t('community.postMedia')}</span>
          <div className={styles.mediaGrid}>
            {mediaUrls.map((url) => (
              <div key={url} className={styles.mediaItem}>
                {isVideoUrl(url) ? <video src={url} muted className={styles.mediaThumb} /> : <img src={url} alt="" className={styles.mediaThumb} />}
                {isVideoUrl(url) && (
                  <span className={styles.videoBadge}>
                    <Video size={11} strokeWidth={2} />
                  </span>
                )}
                <button type="button" className={styles.removeMediaBtn} onClick={() => handleRemoveMedia(url)}>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            ))}

            {!atLimit && (
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMedia.isPending}
              >
                {uploadMedia.isPending ? <Spinner size={18} /> : <ImagePlus size={20} strokeWidth={1.75} />}
                {!uploadMedia.isPending && t('community.addMedia')}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className={styles.hiddenInput}
            onChange={handleFileSelect}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="post-place" className={styles.label}>
            {t('community.postLocation')}
          </label>
          <div className={styles.locationRow}>
            <input
              id="post-place"
              type="text"
              className={styles.locationInput}
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder={t('community.postLocationPlaceholder')}
            />
            <button type="button" className={styles.locationBtn} onClick={handleUseMyLocation} disabled={isLocating}>
              {isLocating ? <Spinner size={16} /> : <MapPin size={16} strokeWidth={2} />}
            </button>
          </div>
          {coords && <span className={styles.locationHint}>{t('community.locationCaptured')}</span>}
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isCreating || uploadMedia.isPending}>
          {isCreating ? <Spinner size={18} /> : t('community.publishPost')}
        </Button>
      </form>
    </Modal>
  );
}
