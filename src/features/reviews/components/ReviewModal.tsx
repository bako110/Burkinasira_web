import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus, X } from 'lucide-react';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateReview } from '../hooks';
import { StarRating } from './StarRating';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  /** Titre de l'élément noté, affiché dans la modale. */
  itemTitle: string;
}

const MAX_PHOTOS = 4;

export function ReviewModal({ open, onClose, bookingId, itemTitle }: ReviewModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createReview = useCreateReview();
  const uploadMedia = useUploadMedia();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  function reset() {
    setRating(0);
    setComment('');
    setPhotos([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file || photos.length >= MAX_PHOTOS) return;
    uploadMedia.mutate(file, {
      onSuccess: (media) => setPhotos((p) => [...p, media.url]),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      push({ variant: 'error', message: t('reviews.ratingRequired') });
      return;
    }
    createReview.mutate(
      { booking_id: bookingId, rating, comment: comment.trim() || undefined, photos },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('reviews.submitted') });
          handleClose();
        },
        onError: (err) =>
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('reviews.modalTitle')}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.itemTitle}>{itemTitle}</p>

        <div className={styles.field}>
          <span className={styles.label}>{t('reviews.yourRating')}</span>
          <StarRating value={rating} size={30} onChange={setRating} label={t('reviews.yourRating')} />
        </div>

        <div className={styles.field}>
          <label htmlFor="review-comment" className={styles.label}>
            {t('reviews.yourComment')}
          </label>
          <textarea
            id="review-comment"
            className={styles.textarea}
            rows={4}
            maxLength={2000}
            placeholder={t('reviews.commentPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>{t('reviews.photosOptional')}</span>
          <div className={styles.photoRow}>
            {photos.map((url) => (
              <span key={url} className={styles.photoThumb}>
                <img src={url} alt="" />
                <button
                  type="button"
                  className={styles.photoRemove}
                  onClick={() => setPhotos((p) => p.filter((u) => u !== url))}
                  aria-label={t('common.delete')}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                className={styles.photoAdd}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMedia.isPending}
              >
                {uploadMedia.isPending ? <Spinner size={16} /> : <ImagePlus size={18} strokeWidth={2} />}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handlePhotoPick}
            />
          </div>
        </div>

        <Button type="submit" fullWidth disabled={createReview.isPending || rating < 1}>
          {createReview.isPending ? <Spinner size={16} /> : t('reviews.submit')}
        </Button>
      </form>
    </Modal>
  );
}
