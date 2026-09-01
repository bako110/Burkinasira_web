import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, Wrench, Clock3, ArrowLeft, ExternalLink } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useRoadServiceDetail } from '../hooks/useRoadServiceDetail';
import styles from './RoadServiceDetailPage.module.css';

export function RoadServiceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading, isError, refetch } = useRoadServiceDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('roads.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/roads')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.roads')}
        </Button>
      </div>
    );
  }

  const location = [service.city, service.region].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps?q=${service.location.latitude},${service.location.longitude}`;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        <div className={styles.heroPlaceholder}>
          <Wrench size={40} strokeWidth={1.5} />
        </div>
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/roads" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`roads.types.${service.type}`, service.type)}</span>
          <h1 className={styles.title}>{service.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {service.offers_24h && (
              <span className={styles.metaItem}>
                <Clock3 size={14} strokeWidth={2} />
                {t('roads.open24h')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {service.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{service.description}</p>
            </section>
          )}

          {service.opening_hours.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {service.opening_hours.map((h) => (
                  <div key={h.day} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{h.day}</span>
                    <span className={styles.hoursTime}>
                      {h.closed ? t('destinations.closed') : `${h.open_time ?? '—'} – ${h.close_time ?? '—'}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {service.contact_phone && (
              <a href={`tel:${service.contact_phone}`} className={styles.contactRow}>
                <Phone size={15} strokeWidth={2} />
                <span>{service.contact_phone}</span>
              </a>
            )}
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
              <ExternalLink size={15} strokeWidth={2} />
              <span>{t('destinations.openInMaps')}</span>
            </a>
          </div>
          <ReportErrorButton itemType="road_service" itemId={service.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/roads" />
    </div>
  );
}
