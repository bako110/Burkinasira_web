import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  ArrowLeft,
  Clock,
  ExternalLink,
  Pill,
  Building2,
  Stethoscope,
  FlaskConical,
  Cross,
  Smile,
  MoreHorizontal,
  PhoneCall,
  Compass,
  HeartPulse,
} from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal } from '../../../shared/ui';
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
  const typeLabel = t(`health.types.${facility.type}`, facility.type);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/health" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Icon size={34} strokeWidth={1.5} />
          </span>
          <div className={styles.heroText}>
            <span className={styles.categoryBadge}>{typeLabel}</span>
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
                  <Clock size={13} strokeWidth={2} />
                  {t('health.onDuty')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {facility.description && (
            <Reveal as="section" className={styles.section}>
              <span className={styles.sectionKicker}>{t('destinations.about')}</span>
              <h2 className={styles.sectionTitle}>{facility.name}</h2>
              <p className={styles.description}>{facility.description}</p>
            </Reveal>
          )}

          <Reveal as="section" className={styles.section} delay={80}>
            <span className={styles.sectionKicker}>{t('common.atAGlance')}</span>
            <h2 className={styles.sectionTitle}>{t('health.practicalInfo')}</h2>
            <div className={styles.factGrid}>
              <div className={styles.factCard}>
                <span className={styles.factIcon}>
                  <Compass size={18} strokeWidth={2} />
                </span>
                <div className={styles.factBody}>
                  <span className={styles.factLabel}>{t('health.title')}</span>
                  <span className={styles.factValue}>{typeLabel}</span>
                </div>
              </div>
              {(facility.address || location) && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <MapPin size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.address')}</span>
                    <span className={styles.factValue}>{facility.address ?? location}</span>
                  </div>
                </div>
              )}
              {facility.contact_phone && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <Phone size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.call')}</span>
                    <span className={styles.factValue}>{facility.contact_phone}</span>
                  </div>
                </div>
              )}
              {facility.is_on_duty && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <HeartPulse size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('health.onDuty')}</span>
                    <span className={styles.factValue}>{t('health.onDutyNotice')}</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {facility.services.length > 0 && (
            <Reveal as="section" className={styles.section} delay={120}>
              <span className={styles.sectionKicker}>{t('health.title')}</span>
              <h2 className={styles.sectionTitle}>{t('destinations.services')}</h2>
              <div className={styles.tagList}>
                {facility.services.map((service) => (
                  <span key={service} className={styles.tag}>
                    {service}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {facility.opening_hours.length > 0 && (
            <Reveal as="section" className={styles.section} delay={160}>
              <span className={styles.sectionKicker}>{t('common.practicalInfo')}</span>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {facility.opening_hours.map((h) => (
                  <div key={h.day} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{h.day}</span>
                    <span className={h.closed ? styles.hoursClosed : styles.hoursTime}>
                      {h.closed ? t('destinations.closed') : `${h.open_time ?? '—'} – ${h.close_time ?? '—'}`}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <span className={styles.infoCardKicker}>
              <Clock size={14} strokeWidth={2} />
              {t('health.practicalInfo')}
            </span>

            {facility.is_on_duty && (
              <div className={styles.onDutyNotice}>
                <Clock size={15} strokeWidth={2} />
                {t('health.onDutyNotice')}
              </div>
            )}

            <div className={styles.ctaRow}>
              {facility.contact_phone && (
                <Button
                  fullWidth
                  onClick={() => {
                    window.location.href = `tel:${facility.contact_phone}`;
                  }}
                >
                  <PhoneCall size={16} strokeWidth={2} />
                  {t('health.callNow')}
                </Button>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.ctaBtnSecondary}>
                  <ExternalLink size={16} strokeWidth={2} />
                  {t('destinations.openInMaps')}
                </a>
              )}
            </div>

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
