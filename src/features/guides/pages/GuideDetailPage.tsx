import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, User, ArrowLeft, Award, Languages, CheckCircle2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import { useGuideDetail } from '../hooks/useGuideDetail';
import styles from './GuideDetailPage.module.css';

export function GuideDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: guide, isLoading, isError, refetch } = useGuideDetail(id);
  const canBook = typeof guide?.daily_rate === 'number';

  function handleContact() {
    requireAuth(() => setModalOpen(true), t('guides.contactRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('guides.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/guides')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.guides')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/guides" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <div className={styles.avatarWrap}>
            {guide.photo_url ? (
              <img src={guide.photo_url} alt={guide.display_name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={32} strokeWidth={1.5} />
              </div>
            )}
            {guide.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
              </span>
            )}
          </div>
          <h1 className={styles.title}>{guide.display_name}</h1>
          <div className={styles.heroMeta}>
            {guide.regions_covered.length > 0 && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {guide.regions_covered.join(', ')}
              </span>
            )}
            {guide.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {guide.average_rating.toFixed(1)} ({guide.review_count})
              </span>
            )}
          </div>
          {guide.visits_completed > 0 && (
            <p className={styles.visitsCount}>{t('guides.visitsCompleted', { count: guide.visits_completed })}</p>
          )}
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {guide.bio && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('guides.about')}</h2>
              <p className={styles.description}>{guide.bio}</p>
            </section>
          )}

          {guide.specialties.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('guides.specialties')}</h2>
              <div className={styles.tagList}>
                {guide.specialties.map((s) => (
                  <span key={s} className={styles.tag}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {guide.languages.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Languages size={18} strokeWidth={2} />
                {t('guides.languages')}
              </h2>
              <div className={styles.tagList}>
                {guide.languages.map((l) => (
                  <span key={l} className={styles.tag}>
                    {l}
                  </span>
                ))}
              </div>
            </section>
          )}

          {guide.certifications.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Award size={18} strokeWidth={2} />
                {t('guides.certifications')}
              </h2>
              <div className={styles.certList}>
                {guide.certifications.map((c, i) => (
                  <div key={i} className={styles.certRow}>
                    <CheckCircle2 size={16} strokeWidth={2} className={styles.certIcon} />
                    <div>
                      <p className={styles.certTitle}>{c.title}</p>
                      {c.issued_by && <p className={styles.certIssuer}>{c.issued_by}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {typeof guide.daily_rate === 'number' && (
              <p className={styles.priceInfo}>
                {t('guides.perDay', { price: guide.daily_rate.toLocaleString('fr-FR'), currency: guide.currency })}
              </p>
            )}
            {typeof guide.hourly_rate === 'number' && (
              <p className={styles.priceInfoSecondary}>
                {guide.hourly_rate.toLocaleString('fr-FR')} {guide.currency} / {t('guides.hour')}
              </p>
            )}
            <Button fullWidth onClick={handleContact} disabled={!canBook}>
              {canBook ? t('guides.contact') : t('guides.rateUnavailable')}
            </Button>
          </div>
        </aside>
      </div>

      <RelatedModules currentPath="/guides" />

      {canBook && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType="guide"
          itemId={guide.id}
          itemTitle={guide.display_name}
          unitPrice={guide.daily_rate!}
          currency={guide.currency}
          requiresDate
        />
      )}
    </div>
  );
}
