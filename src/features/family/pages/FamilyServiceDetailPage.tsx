import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, Users2, ArrowLeft, ExternalLink, ShieldCheck, Baby, Compass } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useFamilyServiceDetail } from '../hooks/useFamilyServiceDetail';
import { BookChildcareModal } from '../components/BookChildcareModal';
import styles from './FamilyServiceDetailPage.module.css';

export function FamilyServiceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [bookOpen, setBookOpen] = useState(false);

  const { data: service, isLoading, isError, refetch } = useFamilyServiceDetail(id);

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
          title={t('family.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/family')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.family')}
        </Button>
      </div>
    );
  }

  const location = [service.city, service.region].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps?q=${service.location.latitude},${service.location.longitude}`;
  const isChildcare = service.type === 'garde_enfants';
  const typeLabel = t(`family.types.${service.type}`, service.type);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/family" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            {isChildcare ? <Baby size={34} strokeWidth={1.5} /> : <Users2 size={34} strokeWidth={1.5} />}
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
              {service.is_family_friendly && (
                <span className={styles.metaItem}>
                  <Users2 size={14} strokeWidth={2} />
                  {t('family.title')}
                </span>
              )}
              {isChildcare && service.is_verified_provider && (
                <span className={styles.verifiedBadge}>
                  <ShieldCheck size={13} strokeWidth={2} />
                  {t('family.verifiedProvider')}
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
                  <span className={styles.factLabel}>{t('family.title')}</span>
                  <span className={styles.factValue}>{typeLabel}</span>
                </div>
              </div>
              {location && (
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
              {isChildcare && (
                <div className={styles.factCard}>
                  <span className={styles.factIcon}>
                    <ShieldCheck size={18} strokeWidth={2} />
                  </span>
                  <div className={styles.factBody}>
                    <span className={styles.factLabel}>{t('family.verifiedProvider')}</span>
                    <span className={styles.factValue}>
                      {service.is_verified_provider ? t('family.verifiedProvider') : '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <span className={styles.infoCardKicker}>
              <MapPin size={14} strokeWidth={2} />
              {t('common.practicalInfo')}
            </span>

            <div className={styles.ctaRow}>
              {isChildcare && (
                <Button
                  fullWidth
                  onClick={() => requireAuth(() => setBookOpen(true), t('family.bookChildcareRequiresAuth'))}
                >
                  {t('family.bookChildcare')}
                </Button>
              )}
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
          <ReportErrorButton itemType="family_service" itemId={service.id} className={styles.reportBtn} />
        </aside>
      </div>

      {isChildcare && (
        <BookChildcareModal serviceId={service.id} open={bookOpen} onClose={() => setBookOpen(false)} />
      )}

      <RelatedModules currentPath="/family" />
    </div>
  );
}
