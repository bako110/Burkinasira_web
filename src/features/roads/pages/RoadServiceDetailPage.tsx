import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, Wrench, Clock3, ArrowLeft, ExternalLink, Compass } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal } from '../../../shared/ui';
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
  const typeLabel = t(`roads.types.${service.type}`, service.type);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/roads" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Wrench size={34} strokeWidth={1.5} />
          </span>
          <div className={styles.heroText}>
            <span className={styles.categoryBadge}>{typeLabel}</span>
            <h1 className={styles.title}>{service.name}</h1>
            <div className={styles.heroMeta}>
              {location && (
                <span className={styles.metaItem}>
                  <MapPin size={14} strokeWidth={2} />
                  {location}
                </span>
              )}
              {service.offers_24h && (
                <span className={styles.badge24h}>
                  <Clock3 size={13} strokeWidth={2} />
                  {t('roads.open24h')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {service.description && (
            <Reveal as="section" className={styles.section}>
              <span className={styles.sectionKicker}>{t('destinations.about')}</span>
              <h2 className={styles.sectionTitle}>{service.name}</h2>
              <p className={styles.description}>{service.description}</p>
            </Reveal>
          )}

          <Reveal as="section" className={styles.section} delay={80}>
            <span className={styles.sectionKicker}>{t('common.atAGlance')}</span>
            <h2 className={styles.sectionTitle}>{t('common.practicalInfo')}</h2>
            <div className={styles.factGrid}>
              <div className={styles.factCard}>
                <span className={styles.factIcon}>
                  <Compass size={18} strokeWidth={2} />
                </span>
                <div className={styles.factBody}>
                  <span className={styles.factLabel}>{t('roads.title')}</span>
                  <span className={styles.factValue}>{typeLabel}</span>
                </div>
              </div>
              {(service.address || location) && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <MapPin size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.address')}</span>
                    <span className={styles.factValue}>{service.address ?? location}</span>
                  </div>
                </div>
              )}
              {service.contact_phone && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <Phone size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.call')}</span>
                    <span className={styles.factValue}>{service.contact_phone}</span>
                  </div>
                </div>
              )}
              {service.offers_24h && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <Clock3 size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('destinations.openingHours')}</span>
                    <span className={styles.factValue}>{t('roads.open24h')}</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {service.opening_hours.length > 0 && (
            <Reveal as="section" className={styles.section} delay={120}>
              <span className={styles.sectionKicker}>{t('roads.title')}</span>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {service.opening_hours.map((h) => (
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
              <Wrench size={14} strokeWidth={2} />
              {t('common.practicalInfo')}
            </span>

            {service.offers_24h && (
              <div className={styles.noticeCard}>
                <Clock3 size={15} strokeWidth={2} />
                {t('roads.open24h')}
              </div>
            )}

            <div className={styles.ctaRow}>
              {service.contact_phone && (
                <a href={`tel:${service.contact_phone}`} className={styles.ctaBtnPrimary}>
                  <Phone size={16} strokeWidth={2} />
                  {t('common.call')}
                </a>
              )}
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.ctaBtnSecondary}>
                <ExternalLink size={16} strokeWidth={2} />
                {t('destinations.openInMaps')}
              </a>
            </div>

            <div className={styles.contactList}>
              {service.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{service.address}</span>
                </div>
              )}
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
          </div>
          <ReportErrorButton itemType="road_service" itemId={service.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/roads" />
    </div>
  );
}
