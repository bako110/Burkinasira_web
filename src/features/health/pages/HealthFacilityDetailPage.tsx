import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, Clock, ExternalLink, Pill, Building2, Stethoscope, FlaskConical, Cross, Smile, MoreHorizontal } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useHealthFacilityDetail } from '../hooks/useHealthFacilityDetail';
import type { HealthFacilityType } from '../types';
import styles from './HealthFacilityDetailPage.module.css';

const ICONS: Record<HealthFacilityType, typeof Pill> = {
  pharmacie: Pill,
  hopital: Building2,
  clinique: Stethoscope,
  laboratoire: FlaskConical,
  centre_premiers_secours: Cross,
  dentiste: Smile,
  autre: MoreHorizontal,
};

export function HealthFacilityDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: facility, isLoading, isError, refetch } = useHealthFacilityDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !facility) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('health.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/health')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.health')}
        </Button>
      </div>
    );
  }

  const Icon = ICONS[facility.type] ?? MoreHorizontal;
  const location = [facility.city, facility.region].filter(Boolean).join(', ');
  const mapsUrl = facility.location
    ? `https://www.google.com/maps?q=${facility.location.latitude},${facility.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/health" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Icon size={28} strokeWidth={1.5} />
          </span>
          <span className={styles.typeLabel}>{t(`health.types.${facility.type}`, facility.type)}</span>
          <h1 className={styles.title}>{facility.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {facility.is_on_duty && (
              <span className={styles.onDutyBadge}>
                <Clock size={14} strokeWidth={2} />
                {t('health.onDuty')}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {facility.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{facility.description}</p>
            </section>
          )}

          {facility.services.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.services')}</h2>
              <div className={styles.tagList}>
                {facility.services.map((service) => (
                  <span key={service} className={styles.tag}>
                    {service}
                  </span>
                ))}
              </div>
            </section>
          )}

          {facility.opening_hours.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {facility.opening_hours.map((h) => (
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
            <div className={styles.contactList}>
              {facility.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{facility.address}</span>
                </div>
              )}
              {facility.contact_phone && (
                <a href={`tel:${facility.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{facility.contact_phone}</span>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <ExternalLink size={15} strokeWidth={2} />
                  <span>{t('destinations.openInMaps')}</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      <RelatedModules currentPath="/health" />
    </div>
  );
}
