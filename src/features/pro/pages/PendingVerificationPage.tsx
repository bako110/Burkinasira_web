import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Upload, CheckCircle2, Lightbulb, AlertTriangle } from 'lucide-react';

import { Button, Card, Spinner, Reveal } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useUploadMedia } from '../../../shared/hooks/useUploadMedia';
import { useToastStore } from '../../../store/toast.store';
import { useAuthStore } from '../../../store/auth.store';
import { useMyVerificationRequests, useSubmitVerificationRequest } from '../hooks/useVerification';
import { GuideProfileForm } from '../components/GuideProfileForm';
import { ProviderProfileForm } from '../components/ProviderProfileForm';
import type { VerificationDocumentType, VerificationStatus } from '../types';
import styles from './PendingVerificationPage.module.css';

const GUIDE_REQUIREMENTS = ['pro.reqIdentityGuide', 'pro.reqProfileGuide', 'pro.reqRegionGuide'];
const PROVIDER_REQUIREMENTS = ['pro.reqIdentityProvider', 'pro.reqBusinessProvider', 'pro.reqAddressProvider'];

const GUIDE_TIPS = ['pro.tipGuide1', 'pro.tipGuide2', 'pro.tipGuide3'];
const PROVIDER_TIPS = ['pro.tipProvider1', 'pro.tipProvider2', 'pro.tipProvider3'];

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

export function PendingVerificationPage() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGuide = user?.role === 'guide';
  const requirements = isGuide ? GUIDE_REQUIREMENTS : PROVIDER_REQUIREMENTS;
  const tips = isGuide ? GUIDE_TIPS : PROVIDER_TIPS;

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
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <ShieldCheck size={26} strokeWidth={1.75} />
          </span>
          <h1 className={styles.title}>{t('pro.pendingTitle')}</h1>
          <p className={styles.subtitle}>{t('pro.pendingSubtitle')}</p>
          <p className={styles.anytimeNotice}>{t('pro.pendingAnytimeNotice')}</p>
        </div>

        <Reveal as="div" className={styles.infoSection} delay={0}>
          <h2 className={styles.infoTitle}>
            <CheckCircle2 size={18} strokeWidth={2} />
            {t('pro.requirementsTitle')}
          </h2>
          <ul className={styles.checkList}>
            {requirements.map((key) => (
              <li key={key} className={styles.checkItem}>
                <CheckCircle2 size={15} strokeWidth={2} className={styles.checkIcon} />
                {t(key)}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" className={styles.tipSection} delay={60}>
          <h2 className={styles.tipTitle}>
            <Lightbulb size={18} strokeWidth={2} />
            {t('pro.tipsTitle')}
          </h2>
          <ul className={styles.tipList}>
            {tips.map((key) => (
              <li key={key} className={styles.tipItem}>
                <span className={styles.tipBullet} />
                {t(key)}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className={styles.zone} delay={120}>
          <span className={styles.stepBadge}>
            <span className={styles.stepNumber}>1</span>
            {t('pro.editProfileZone')}
          </span>
          <h2 className={styles.listTitle}>{isGuide ? t('pro.guideProfileTitle') : t('pro.providerProfileTitle')}</h2>
          <p className={styles.zoneHint}>{t('pro.editProfileZoneHint')}</p>
          {isGuide ? <GuideProfileForm /> : <ProviderProfileForm />}
        </Reveal>

        <hr className={styles.divider} />

        <Reveal as="section" className={styles.zone} delay={160}>
          <span className={styles.stepBadge}>
            <span className={styles.stepNumber}>2</span>
            {t('pro.submitDocumentTitle')}
          </span>
          <h2 className={styles.listTitle}>{t('pro.submitDocumentTitle')}</h2>
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
            <button
              type="button"
              className={styles.fileButton}
              onClick={() => fileInputRef.current?.click()}
            >
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

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? <Spinner size={18} /> : t('pro.submitDocument')}
            </Button>
          </form>
        </Reveal>

        <hr className={styles.divider} />

        <Reveal as="section" className={styles.zone} delay={200}>
          <span className={styles.stepBadge}>
            <span className={styles.stepNumber}>3</span>
            {t('pro.submittedDocuments')}
          </span>
          <h2 className={styles.listTitle}>{t('pro.submittedDocuments')}</h2>
          <p className={styles.zoneHint}>{t('pro.submittedDocumentsHint')}</p>

          {isLoading && <Spinner size={22} />}

          {!isLoading && requests && requests.length === 0 && (
            <p className={styles.subtitle}>{t('pro.noDocumentsYet')}</p>
          )}

          {!isLoading && requests && requests.length > 0 && (
            <div className={styles.requestList}>
              {requests.map((r, i) => (
                <Reveal key={r.id} delay={Math.min(i, 8) * 50}>
                <div className={`${styles.requestItem} ${REQUEST_ITEM_CLASS[r.status]}`}>
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
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>

        <div className={styles.logoutRow}>
          <button type="button" className={styles.logoutButton} onClick={clearSession}>
            {t('auth.logout')}
          </button>
        </div>
      </Card>
    </div>
  );
}
