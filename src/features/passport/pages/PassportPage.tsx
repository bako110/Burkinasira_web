import { useTranslation } from 'react-i18next';
import { Trophy, MapPin } from 'lucide-react';

import { Card, Spinner, Reveal, DetailBackButton } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { useMyPassport } from '../hooks/useMyPassport';
import { useBadges } from '../hooks/useBadges';
import { BadgeTile } from '../components/BadgeTile';
import { BurkinaSiraIdCard } from '../components/BurkinaSiraIdCard';
import styles from './PassportPage.module.css';

export function PassportPage() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: passport, isLoading: isLoadingPassport } = useMyPassport();
  const { data: badges, isLoading: isLoadingBadges } = useBadges();

  const isLoading = isLoadingPassport || isLoadingBadges;
  const fallbackPath =
    user?.role === 'guide' ? '/pro/guide' : user?.role === 'provider' ? '/pro/provider' : '/profile';

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo={fallbackPath} variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('passport.title')}</h1>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && passport && user && (
        <>
          <section>
            <h2 className={styles.sectionTitle}>{t('passport.cardTitle')}</h2>
            <BurkinaSiraIdCard user={user} points={passport.points} />
          </section>

          <Card className={styles.pointsCard}>
            <Trophy size={32} strokeWidth={1.5} className={styles.pointsIcon} />
            <div>
              <span className={styles.pointsValue}>{passport.points.toLocaleString('fr-FR')}</span>
              <span className={styles.pointsLabel}>{t('passport.points')}</span>
            </div>
          </Card>

          <section>
            <h2 className={styles.sectionTitle}>{t('passport.badgesTitle')}</h2>
            {badges && badges.length > 0 ? (
              <div className={styles.badgeGrid}>
                {badges.map((badge, i) => (
                  <Reveal key={badge.id} delay={Math.min(i, 8) * 40}>
                    <BadgeTile badge={badge} earned={passport.earned_badge_ids.includes(badge.id)} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>{t('passport.noBadges')}</p>
            )}
          </section>

          <section>
            <h2 className={styles.sectionTitle}>{t('passport.stampsTitle')}</h2>
            {passport.stamps.length > 0 ? (
              <div className={styles.stampList}>
                {passport.stamps.map((stamp, i) => (
                  <Reveal key={`${stamp.destination_id}-${i}`} delay={Math.min(i, 8) * 40}>
                    <div className={styles.stampRow}>
                      <MapPin size={16} strokeWidth={2} className={styles.stampIcon} />
                      <span className={styles.stampName}>{stamp.destination_name}</span>
                      <span className={styles.stampDate}>
                        {new Date(stamp.collected_at).toLocaleDateString(i18n.language)}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>{t('passport.noStamps')}</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
