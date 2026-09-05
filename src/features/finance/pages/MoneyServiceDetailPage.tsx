import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, ExternalLink, Landmark, CreditCard, Smartphone, ArrowLeftRight } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useMoneyServiceDetail } from '../hooks/useMoneyServiceDetail';
import type { MoneyServiceType } from '../types';
import styles from './MoneyServiceDetailPage.module.css';

const ICONS: Record<MoneyServiceType, typeof Landmark> = {
  banque: Landmark,
  distributeur: CreditCard,
  mobile_money: Smartphone,
  bureau_change: ArrowLeftRight,
};

export function MoneyServiceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading, isError, refetch } = useMoneyServiceDetail(id);

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
          title={t('finance.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/finance')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.finance')}
        </Button>
      </div>
    );
  }

  const Icon = ICONS[service.type] ?? Landmark;
  const location = [service.city, service.region].filter(Boolean).join(', ');
  const mapsUrl = service.location
    ? `https://www.google.com/maps?q=${service.location.latitude},${service.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/finance" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Icon size={28} strokeWidth={1.5} />
          </span>
          <div className={styles.heroText}>
            <span className={styles.typeLabel}>{t(`finance.types.${service.type}`, service.type)}</span>
            <h1 className={styles.title}>{service.name}</h1>
            {service.operator && <p className={styles.operator}>{service.operator}</p>}
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
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
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

      <RelatedModules currentPath="/finance" />
    </div>
  );
}
