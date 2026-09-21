import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, X } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUpdateGroup } from '../hooks/useGroups';
import { GROUP_THEMES, type GroupDetail } from '../types';
import { BURKINA_REGIONS } from '../../weather/types';
import styles from './CreateGroupModal.module.css';

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetail;
}

export function EditGroupModal({ open, onClose, group }: EditGroupModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, error } = useUpdateGroup(group.id);
  const uploadMedia = useUploadMedia();

  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description ?? '');
  const [coverPhoto, setCoverPhoto] = useState<string | null>(group.cover_photo ?? null);
  const [region, setRegion] = useState(group.region ?? '');
  const [customRegion, setCustomRegion] = useState('');
  const [theme, setTheme] = useState(group.theme ?? '');
  const [isPublic, setIsPublic] = useState(group.is_public);

  // Recharge les champs à chaque ouverture pour refléter l'état actuel du groupe
  // (au cas où il a été modifié ailleurs depuis la dernière ouverture du modal).
  useEffect(() => {
    if (!open) return;
    setName(group.name);
    setDescription(group.description ?? '');
    setCoverPhoto(group.cover_photo ?? null);
    const knownRegion = group.region && BURKINA_REGIONS.includes(group.region as (typeof BURKINA_REGIONS)[number]);
    setRegion(knownRegion ? (group.region as string) : group.region ? '__other__' : '');
    setCustomRegion(knownRegion ? '' : (group.region ?? ''));
    setTheme(group.theme ?? '');
    setIsPublic(group.is_public);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group.id]);

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
        onSuccess: () => {
          push({ variant: 'success', message: t('community.groupUpdated') });
          onClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={t('community.editGroupTitle')}>
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
          name="edit-group-name"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="edit-group-description" className={styles.label}>
            {t('community.groupDescriptionLabel')}
          </label>
          <textarea
            id="edit-group-description"
            className={styles.textarea}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="edit-group-region" className={styles.label}>
              {t('community.regionLabel')}
            </label>
            <select
              id="edit-group-region"
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
            <label htmlFor="edit-group-theme" className={styles.label}>
              {t('community.themeLabel')}
            </label>
            <select
              id="edit-group-theme"
              className={styles.select}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
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
            name="edit-group-custom-region"
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
          {isPending ? <Spinner size={18} /> : t('common.save')}
        </Button>
      </form>
    </Modal>
  );
}
