import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Phone, ShieldCheck, ArrowLeft, Car, ExternalLink } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useTransportProviderDetail } from '../hooks/useTransportProviderDetail';
import styles from './TransportDetailPage.module.css';

export function TransportDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: provider, isLoading, isError, refetch } = useTransportProviderDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('mobility.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/mobility')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.mobility')}
        </Button>
      </div>
    );
  }

  const location = [provider.city, provider.region].filter(Boolean).join(', ');
  const mapsUrl = provider.base_location
    ? `https://www.google.com/maps?q=${provider.base_location.latitude},${provider.base_location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/mobility" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Car size={28} strokeWidth={1.5} />
          </span>
          <span className={styles.typeLabel}>{t(`mobility.types.${provider.type}`, provider.type)}</span>
          <h1 className={styles.title}>{provider.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {provider.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {provider.average_rating.toFixed(1)} ({provider.review_count})
              </span>
            )}
            {provider.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
                {t('destinations.verified')}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {provider.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{provider.description}</p>
            </section>
          )}

          {provider.vehicle_info && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('mobility.vehicleInfo')}</h2>
              <p className={styles.description}>{provider.vehicle_info}</p>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {typeof provider.price_estimate === 'number' && (
              <p className={styles.priceInfo}>
                {t('mobility.fromPrice', {
                  price: provider.price_estimate.toLocaleString('fr-FR'),
                  currency: provider.price_currency,
                })}
              </p>
            )}
            <div className={styles.contactList}>
              {provider.contact_phone && (
                <a href={`tel:${provider.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{provider.contact_phone}</span>
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

      <RelatedModules currentPath="/mobility" />
    </div>
  );
}
