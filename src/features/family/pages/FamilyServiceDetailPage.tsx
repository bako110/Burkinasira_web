import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, Users2, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
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

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        <div className={styles.heroPlaceholder}>
          <Users2 size={40} strokeWidth={1.5} />
        </div>
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/family" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`family.types.${service.type}`, service.type)}</span>
          <h1 className={styles.title}>{service.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
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

      <div className={styles.body}>
        <div className={styles.main}>
          {service.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{service.description}</p>
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
            {isChildcare && (
              <Button fullWidth onClick={() => requireAuth(() => setBookOpen(true), t('family.bookChildcareRequiresAuth'))}>
                {t('family.bookChildcare')}
              </Button>
            )}
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
              <ExternalLink size={15} strokeWidth={2} />
              <span>{t('destinations.openInMaps')}</span>
            </a>
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
