import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, User, Calendar } from 'lucide-react';

import { Spinner, EmptyResults } from '../../../shared/ui';
import { useVerification } from '../hooks/useVerification';
import styles from './VerifyCardPage.module.css';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function VerifyCardPage() {
  const { t, i18n } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading, isError } = useVerification(userId);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img src="/logo.png" alt="FasoViva" className={styles.logo} />
        <span className={styles.brand}>FasoViva</span>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && (isError || !data) && (
        <div className={styles.center}>
          <EmptyResults variant="error" title={t('verify.notFoundTitle')} text={t('verify.notFoundText')} />
        </div>
      )}

      {!isLoading && data && (
        <div className={styles.card}>
          <div className={styles.photoWrap}>
            {data.avatar_url ? (
              <img src={data.avatar_url} alt={data.full_name} className={styles.photo} />
            ) : (
              <User size={40} strokeWidth={1.5} />
            )}
          </div>

          <div className={styles.nameRow}>
            <span className={styles.name}>{data.full_name}</span>
            {data.is_verified && <BadgeCheck size={20} strokeWidth={2} className={styles.verifiedIcon} />}
          </div>

          <span className={styles.role}>{t(`auth.role${capitalize(data.role)}`, data.role)}</span>

          {data.is_verified && (
            <div className={styles.statusBadge}>
              <BadgeCheck size={16} strokeWidth={2} />
              {t('verify.verifiedMember')}
            </div>
          )}

          <div className={styles.validBadge}>
            <BadgeCheck size={16} strokeWidth={2} />
            {t('verify.cardIsValid')}
          </div>

          <div className={styles.metaRow}>
            <Calendar size={14} strokeWidth={2} />
            {t('passport.memberSince', {
              date: new Date(data.member_since).toLocaleDateString(i18n.language, {
                year: 'numeric',
                month: 'short',
              }),
            })}
          </div>

          <p className={styles.disclaimer}>{t('verify.disclaimer')}</p>
        </div>
      )}
    </div>
  );
}
