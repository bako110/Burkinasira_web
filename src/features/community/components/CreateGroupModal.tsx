import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateGroup } from '../hooks/useGroups';
import { GROUP_THEMES } from '../types';
import { BURKINA_REGIONS } from '../../weather/types';
import styles from './CreateGroupModal.module.css';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, error } = useCreateGroup();
  const uploadMedia = useUploadMedia();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [region, setRegion] = useState('');
  const [customRegion, setCustomRegion] = useState('');
  const [theme, setTheme] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  function resetAndClose() {
    setName('');
    setDescription('');
    setCoverPhoto(null);
    setRegion('');
    setCustomRegion('');
    setTheme('');
    setIsPublic(true);
    onClose();
  }

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (result) => setCoverPhoto(result.url),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalRegion = region === '__other__' ? customRegion : region;
    mutate(
      {
        name,
        description: description || undefined,
        cover_photo: coverPhoto || undefined,
        region: finalRegion || undefined,
        theme: theme || undefined,
        is_public: isPublic,
      },
      {
        onSuccess: (group) => {
          push({ variant: 'success', message: t('community.groupCreated') });
          resetAndClose();
          navigate(`/community/groups/${group.id}`);
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('community.createGroupTitle')}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.coverField}>
          <button
            type="button"
            className={styles.coverButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
          >
            {coverPhoto ? (
              <img src={coverPhoto} alt="" className={styles.coverPreview} />
            ) : (
              <span className={styles.coverPlaceholder}>
                {uploadMedia.isPending ? <Spinner size={20} /> : <Camera size={22} strokeWidth={1.75} />}
                <span className={styles.coverPlaceholderText}>{t('community.groupCoverLabel')}</span>
              </span>
            )}
          </button>
          {coverPhoto && (
            <button
              type="button"
              className={styles.coverRemoveBtn}
              onClick={() => setCoverPhoto(null)}
              aria-label={t('common.delete')}
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.hiddenInput}
            onChange={handleCoverSelect}
          />
        </div>

        <Input
          label={t('community.groupNameLabel')}
          name="group-name"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="group-description" className={styles.label}>
            {t('community.groupDescriptionLabel')}
          </label>
          <textarea
            id="group-description"
            className={styles.textarea}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="group-region" className={styles.label}>
              {t('community.regionLabel')}
            </label>
            <select
              id="group-region"
              className={styles.select}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">{t('community.allRegions')}</option>
              {BURKINA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="__other__">{t('community.otherRegion')}</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="group-theme" className={styles.label}>
              {t('community.themeLabel')}
            </label>
            <select id="group-theme" className={styles.select} value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="">{t('community.allThemes')}</option>
              {GROUP_THEMES.map((th) => (
                <option key={th} value={th}>
                  {t(`community.themes.${th}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {region === '__other__' && (
          <Input
            label={t('community.customRegionLabel')}
            name="group-custom-region"
            placeholder={t('community.customRegionPlaceholder')}
            value={customRegion}
            onChange={(e) => setCustomRegion(e.target.value)}
          />
        )}

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          {t('community.publicGroupLabel')}
        </label>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('community.createGroup')}
        </Button>
      </form>
    </Modal>
  );
}
