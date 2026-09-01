import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Users, GraduationCap, ArrowLeft, ExternalLink } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useEduOutingDetail } from '../hooks/useEduOutingDetail';
import { BookOutingModal } from '../components/BookOutingModal';
import styles from './EduOutingDetailPage.module.css';

export function EduOutingDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [bookOpen, setBookOpen] = useState(false);

  const { data: outing, isLoading, isError, refetch } = useEduOutingDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !outing) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('edu.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/edu')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.edu')}
        </Button>
      </div>
    );
  }

  const location = [outing.city, outing.region].filter(Boolean).join(', ');
  const mapsUrl = outing.location
    ? `https://www.google.com/maps?q=${outing.location.latitude},${outing.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        <div className={styles.heroPlaceholder}>
          <GraduationCap size={40} strokeWidth={1.5} />
        </div>
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/edu" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`edu.types.${outing.type}`, outing.type)}</span>
          <h1 className={styles.title}>{outing.title}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
            <p className={styles.description}>{outing.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('edu.details')}</h2>
            <div className={styles.detailsList}>
              {outing.target_level && (
                <div className={styles.detailRow}>
                  <GraduationCap size={16} strokeWidth={2} />
                  <span>{outing.target_level}</span>
                </div>
              )}
              {typeof outing.max_participants === 'number' && (
                <div className={styles.detailRow}>
                  <Users size={16} strokeWidth={2} />
                  <span>{t('edu.maxParticipants', { count: outing.max_participants })}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {typeof outing.price_per_participant === 'number' ? (
              <p className={styles.priceInfo}>
                {outing.price_per_participant.toLocaleString('fr-FR')} {outing.currency} / {t('edu.perParticipant')}
              </p>
            ) : (
              <p className={styles.priceInfo}>{t('edu.priceOnRequest')}</p>
            )}
            <Button fullWidth onClick={() => requireAuth(() => setBookOpen(true), t('edu.bookRequiresAuth'))}>
              {t('edu.bookForGroup')}
            </Button>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                <ExternalLink size={15} strokeWidth={2} />
                <span>{t('destinations.openInMaps')}</span>
              </a>
            )}
          </div>
          <ReportErrorButton itemType="edu_outing" itemId={outing.id} className={styles.reportBtn} />
        </aside>
      </div>

      <BookOutingModal outingId={outing.id} open={bookOpen} onClose={() => setBookOpen(false)} />

      <RelatedModules currentPath="/edu" />
    </div>
  );
}
