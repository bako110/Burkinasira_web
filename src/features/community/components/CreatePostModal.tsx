import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus, X } from 'lucide-react';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreatePost } from '../hooks/useCreatePost';
import type { PostType } from '../types';
import styles from './CreatePostModal.module.css';

const POST_TYPES: PostType[] = ['recommandation', 'carnet_voyage', 'photo', 'video'];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  groupId?: string;
}

export function CreatePostModal({ open, onClose, groupId }: CreatePostModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending: isUploading } = useUploadMedia();
  const { mutate: create, isPending: isCreating, error } = useCreatePost();

  const [type, setType] = useState<PostType>('recommandation');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  function resetAndClose() {
    setType('recommandation');
    setCaption('');
    setMediaUrl(null);
    setMediaPreview(null);
    onClose();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaPreview(URL.createObjectURL(file));
    upload(file, {
      onSuccess: (result) => {
        setMediaUrl(result.url);
        if (result.resource_type === 'video') setType('video');
        else if (type !== 'carnet_voyage' && type !== 'recommandation') setType('photo');
      },
      onError: (err) => {
        push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        setMediaPreview(null);
      },
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    create(
      {
        type,
        caption: caption || undefined,
        media_urls: mediaUrl ? [mediaUrl] : [],
        group_id: groupId,
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
          {mediaPreview ? (
            <div className={styles.previewWrap}>
              {type === 'video' ? (
                <video src={mediaPreview} className={styles.preview} controls />
              ) : (
                <img src={mediaPreview} alt="" className={styles.preview} />
              )}
              {isUploading && (
                <div className={styles.uploadingOverlay}>
                  <Spinner size={24} />
                </div>
              )}
              <button
                type="button"
                className={styles.removeMediaBtn}
                onClick={() => {
                  setMediaPreview(null);
                  setMediaUrl(null);
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={20} strokeWidth={1.75} />
              {t('community.addMedia')}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className={styles.hiddenInput}
            onChange={handleFileSelect}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isCreating || isUploading}>
          {isCreating ? <Spinner size={18} /> : t('community.publishPost')}
        </Button>
      </form>
    </Modal>
  );
}
