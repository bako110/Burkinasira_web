import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  ArrowLeft,
  ExternalLink,
  Wifi,
  Radio,
  Store,
  Building,
  Gift,
  Smartphone,
  Compass,
} from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal } from '../../../shared/ui';
import { useConnectivityPointDetail } from '../hooks/useConnectivityPointDetail';
import type { ConnectivityPointType } from '../types';
import styles from './ConnectivityPointDetailPage.module.css';

const ICONS: Record<ConnectivityPointType, typeof Wifi> = {
  operateur_telecom: Radio,
  point_vente_sim: Store,
  wifi_public: Wifi,
  wifi_prive: Wifi,
  coworking: Building,
  boutique_telephonie: Store,
};

export function ConnectivityPointDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: point, isLoading, isError, refetch } = useConnectivityPointDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !point) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('connectivity.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/connectivity')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.connectivity')}
        </Button>
      </div>
    );
  }

  const Icon = ICONS[point.type] ?? Wifi;
  const location = [point.city, point.region].filter(Boolean).join(', ');
  const mapsUrl = point.location
    ? `https://www.google.com/maps?q=${point.location.latitude},${point.location.longitude}`
    : undefined;
  const hasConnectionInfo = point.is_free || point.offers_esim;
  const typeLabel = t(`connectivity.types.${point.type}`, point.type);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/connectivity" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Icon size={34} strokeWidth={1.5} />
          </span>
          <div className={styles.heroText}>
            <span className={styles.categoryBadge}>{typeLabel}</span>
            <h1 className={styles.title}>{point.name}</h1>
            {point.operator && <p className={styles.operator}>{point.operator}</p>}
            <div className={styles.heroMeta}>
              {location && (
                <span className={styles.metaItem}>
                  <MapPin size={14} strokeWidth={2} />
                  {location}
                </span>
              )}
              {point.is_free && <span className={styles.badgeFree}>{t('connectivity.free')}</span>}
              {point.offers_esim && <span className={styles.badgeEsim}>{t('connectivity.esim')}</span>}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          <Reveal as="section" className={styles.section}>
            <span className={styles.sectionKicker}>{t('common.atAGlance')}</span>
            <h2 className={styles.sectionTitle}>{t('connectivity.connectionInfo')}</h2>
            <div className={styles.tagList}>
              <span className={styles.tag}>
                <Icon size={14} strokeWidth={2} />
                {typeLabel}
              </span>
              {point.is_free && (
                <span className={styles.tag}>
                  <Gift size={14} strokeWidth={2} />
                  {t('connectivity.free')}
                </span>
              )}
              {point.offers_esim && (
                <span className={styles.tag}>
                  <Smartphone size={14} strokeWidth={2} />
                  {t('connectivity.esim')}
                </span>
              )}
            </div>
            {!hasConnectionInfo && <p className={styles.description}>{t('connectivity.noExtraInfo')}</p>}
          </Reveal>

          <Reveal as="section" className={styles.section} delay={80}>
            <span className={styles.sectionKicker}>{t('connectivity.badge')}</span>
            <h2 className={styles.sectionTitle}>{t('common.practicalInfo')}</h2>
            <div className={styles.factGrid}>
              <div className={styles.factCard}>
                <span className={styles.factIcon}>
                  <Compass size={18} strokeWidth={2} />
                </span>
                <div className={styles.factBody}>
                  <span className={styles.factLabel}>{t('connectivity.title')}</span>
                  <span className={styles.factValue}>{typeLabel}</span>
                </div>
              </div>
              {point.operator && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <Radio size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('connectivity.filters.operateur_telecom')}</span>
                    <span className={styles.factValue}>{point.operator}</span>
                  </div>
                </div>
              )}
              {(point.address || location) && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <MapPin size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.address')}</span>
                    <span className={styles.factValue}>{point.address ?? location}</span>
                  </div>
                </div>
              )}
              {point.contact_phone && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <Phone size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('common.call')}</span>
                    <span className={styles.factValue}>{point.contact_phone}</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <span className={styles.infoCardKicker}>
              <Wifi size={14} strokeWidth={2} />
              {t('connectivity.badge')}
            </span>

            <div className={styles.ctaRow}>
              {point.contact_phone && (
                <a href={`tel:${point.contact_phone}`} className={styles.ctaBtnPrimary}>
                  <Phone size={16} strokeWidth={2} />
                  {t('common.call')}
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.ctaBtnSecondary}>
                  <ExternalLink size={16} strokeWidth={2} />
                  {t('destinations.openInMaps')}
                </a>
              )}
            </div>

            <div className={styles.contactList}>
              {point.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{point.address}</span>
                </div>
              )}
              {point.contact_phone && (
                <a href={`tel:${point.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{point.contact_phone}</span>
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

      <RelatedModules currentPath="/connectivity" />
    </div>
  );
}
