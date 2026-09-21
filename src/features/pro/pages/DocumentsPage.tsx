import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, AlertTriangle } from 'lucide-react';

import { Button, Card, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { useAuthStore } from '../../../store/auth.store';
import { useMyVerificationRequests, useSubmitVerificationRequest } from '../hooks/useVerification';
import { GuideProfileForm } from '../components/GuideProfileForm';
import { ProviderProfileForm } from '../components/ProviderProfileForm';
import { ProPageHeader } from '../components/ProPageHeader';
import type { VerificationDocumentType, VerificationStatus } from '../types';
import styles from './DocumentsPage.module.css';
import wrapperStyles from './ProPageWrapper.module.css';

const DOCUMENT_TYPES: { value: VerificationDocumentType; labelKey: string }[] = [
  { value: 'piece_identite', labelKey: 'pro.docPieceIdentite' },
  { value: 'document_professionnel', labelKey: 'pro.docProfessionnel' },
  { value: 'justificatif_adresse', labelKey: 'pro.docJustificatifAdresse' },
  { value: 'autre', labelKey: 'pro.docAutre' },
];

const BADGE_CLASS: Record<VerificationStatus, string> = {
  pending: styles.badgePending,
  active: styles.badgeActive,
  suspended: styles.badgeRejected,
  rejected: styles.badgeRejected,
};

const REQUEST_ITEM_CLASS: Record<VerificationStatus, string> = {
  pending: styles.requestItemPending,
  active: styles.requestItemActive,
  suspended: styles.requestItemRejected,
  rejected: styles.requestItemRejected,
};

export function DocumentsPage() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGuide = user?.role === 'guide';

  const { data: requests, isLoading } = useMyVerificationRequests();
  const uploadMedia = useUploadMedia();
  const submitRequest = useSubmitVerificationRequest();

  const [documentType, setDocumentType] = useState<VerificationDocumentType>('piece_identite');
  const [file, setFile] = useState<File | null>(null);

  const isSubmitting = uploadMedia.isPending || submitRequest.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      push({ variant: 'error', message: t('pro.selectFileFirst') });
      return;
    }
    uploadMedia.mutate(file, {
      onSuccess: (media) => {
        submitRequest.mutate(
          { document_type: documentType, document_url: media.url },
          {
            onSuccess: () => {
              push({ variant: 'success', message: t('pro.documentSubmitted') });
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
          },
        );
      },
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  return (
    <div className={wrapperStyles.page}>
      <ProPageHeader kicker={t('pro.documentsKicker')} title={t('pro.documentsTitle')} subtitle={t('pro.documentsSubtitle')} />

      <Card className={styles.zoneCard}>
        <h2 className={styles.zoneTitle}>{isGuide ? t('pro.guideProfileTitle') : t('pro.providerProfileTitle')}</h2>
        <p className={styles.zoneHint}>{t('pro.editProfileZoneHint')}</p>
        {isGuide ? <GuideProfileForm /> : <ProviderProfileForm />}
      </Card>

      <Card className={styles.zoneCard}>
        <h2 className={styles.zoneTitle}>{t('pro.submitDocumentTitle')}</h2>
        <p className={styles.zoneHint}>{t('pro.submitDocumentZoneHint')}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="document_type" className={styles.label}>
              {t('pro.documentType')}
            </label>
            <select
              id="document_type"
              className={styles.select}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as VerificationDocumentType)}
            >
              {DOCUMENT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fileRow}>
            <button type="button" className={styles.fileButton} onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} strokeWidth={2} />
              {t('pro.chooseFile')}
            </button>
            {file && <span className={styles.fileName}>{file.name}</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <p className={styles.fileHint}>{t('pro.fileFormatsHint')}</p>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size={18} /> : t('pro.submitDocument')}
          </Button>
        </form>
      </Card>

      <Card className={styles.zoneCard}>
        <h2 className={styles.zoneTitle}>{t('pro.submittedDocuments')}</h2>
        <p className={styles.zoneHint}>{t('pro.submittedDocumentsHint')}</p>

        {isLoading && <Spinner size={22} />}

        {!isLoading && requests && requests.length === 0 && (
          <p className={styles.emptyText}>{t('pro.noDocumentsYet')}</p>
        )}

        {!isLoading && requests && requests.length > 0 && (
          <div className={styles.requestList}>
            {requests.map((r) => (
              <div key={r.id} className={`${styles.requestItem} ${REQUEST_ITEM_CLASS[r.status]}`}>
                <div className={styles.requestItemRow}>
                  <span className={styles.requestType}>
                    {t(DOCUMENT_TYPES.find((d) => d.value === r.document_type)?.labelKey ?? 'pro.docAutre')}
                  </span>
                  <span className={`${styles.badge} ${BADGE_CLASS[r.status]}`}>{t(`pro.status_${r.status}`)}</span>
                </div>
                {(r.status === 'rejected' || r.status === 'suspended') && r.review_notes && (
                  <p className={styles.reviewNotes}>
                    <AlertTriangle size={14} strokeWidth={2} className={styles.reviewNotesIcon} />
                    <span>
                      <strong>{t('pro.reviewNotesLabel')}</strong> {r.review_notes}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
