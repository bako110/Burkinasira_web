import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Globe2, Play, X } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateMemory } from '../hooks';
import type { MemoryMediaType, MemoryTargetType } from '../types';
import styles from './ShareMemoryModal.module.css';

interface ShareMemoryModalProps {
  open: boolean;
  onClose: () => void;
  targetType: MemoryTargetType;
  targetId: string;
}

export function ShareMemoryModal({ open, onClose, targetType, targetId }: ShareMemoryModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useUploadMedia();
  const createMemory = useCreateMemory();

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MemoryMediaType | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');

  const isSubmitting = uploadMedia.isPending || createMemory.isPending;

  function resetAndClose() {
    setMediaUrl(null);
    setMediaType(null);
    setTitle('');
    setCaption('');
    onClose();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (uploaded) => {
        setMediaUrl(uploaded.url);
        setMediaType(uploaded.resource_type === 'video' ? 'video' : 'photo');
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!mediaUrl || !mediaType) return;
    createMemory.mutate(
      {
        target_type: targetType,
        target_id: targetId,
        media_url: mediaUrl,
        media_type: mediaType,
        title: title || undefined,
        caption: caption || undefined,
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('memories.shared') });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('memories.shareTitle')}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.publicNotice}>
          <Globe2 size={14} strokeWidth={2} />
          {t('memories.publicNotice')}
        </p>

        <div className={styles.mediaField}>
          <button
            type="button"
            className={styles.mediaButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
          >
            {mediaUrl ? (
              mediaType === 'video' ? (
                <span className={styles.mediaPreviewWrap}>
                  <video src={mediaUrl} className={styles.mediaPreview} muted playsInline />
                  <span className={styles.playBadge}>
                    <Play size={16} strokeWidth={2} fill="currentColor" />
                  </span>
                </span>
              ) : (
                <img src={mediaUrl} alt="" className={styles.mediaPreview} />
              )
            ) : (
              <span className={styles.mediaPlaceholder}>
                {uploadMedia.isPending ? <Spinner size={22} /> : <Camera size={26} strokeWidth={1.75} />}
                <span className={styles.mediaPlaceholderText}>{t('memories.pickFile')}</span>
              </span>
            )}
          </button>
          {mediaUrl && (
            <button
              type="button"
              className={styles.mediaRemoveBtn}
              onClick={() => {
                setMediaUrl(null);
                setMediaType(null);
              }}
              aria-label={t('common.delete')}
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            hidden
            onChange={handleFileSelected}
          />
        </div>

        <Input
          label={t('memories.titleLabel')}
          name="memory-title"
          placeholder={t('memories.titlePlaceholder')}
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="memory-caption" className={styles.label}>
            {t('memories.descriptionLabel')}
          </label>
          <textarea
            id="memory-caption"
            className={styles.textarea}
            rows={3}
            maxLength={500}
            placeholder={t('memories.descriptionPlaceholder')}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting || !mediaUrl}>
          {isSubmitting ? <Spinner size={18} /> : t('memories.shareCta')}
        </Button>
      </form>
    </Modal>
  );
}
