import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Languages, ImageOff, ArrowLeft, ExternalLink, Info } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useExperienceDetail } from '../hooks/useExperienceDetail';
import styles from './ExperienceDetailPage.module.css';

export function ExperienceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: experience, isLoading, isError, refetch } = useExperienceDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !experience) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('experiences.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/experiences')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.experiences')}
        </Button>
      </div>
    );
  }

  const cover = experience.photos?.[0];
  const gallery = experience.photos?.slice(1, 5) ?? [];
  const location = [experience.city, experience.region].filter(Boolean).join(', ');
  const mapsUrl = experience.location
    ? `https://www.google.com/maps?q=${experience.location.latitude},${experience.location.longitude}`
    : undefined;
  const durationHours = experience.duration_minutes ? experience.duration_minutes / 60 : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {cover ? (
          <img src={cover} alt={experience.title} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/experiences" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`experiences.types.${experience.type}`, experience.type)}</span>
          <h1 className={styles.title}>{experience.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>{t('experiences.hostedBy', { name: experience.host_name })}</span>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {experience.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {experience.average_rating.toFixed(1)} ({experience.review_count})
              </span>
            )}
          </div>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className={styles.gallery}>
          {gallery.map((photo, i) => (
            <img key={i} src={photo} alt="" className={styles.galleryImg} loading="lazy" />
          ))}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
            <p className={styles.description}>{experience.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('experiences.details')}</h2>
            <div className={styles.detailsList}>
              {typeof durationHours === 'number' && (
                <div className={styles.detailRow}>
                  <Clock size={16} strokeWidth={2} />
                  <span>{t('experiences.duration', { hours: durationHours })}</span>
                </div>
              )}
              {typeof experience.max_participants === 'number' && (
                <div className={styles.detailRow}>
                  <Users size={16} strokeWidth={2} />
                  <span>{t('experiences.maxParticipants', { count: experience.max_participants })}</span>
                </div>
              )}
              {experience.languages.length > 0 && (
                <div className={styles.detailRow}>
                  <Languages size={16} strokeWidth={2} />
                  <span>{experience.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </section>

          {experience.revenue_share && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Info size={16} strokeWidth={2} />
                {t('experiences.revenueShareTitle')}
              </h2>
              <div className={styles.revenueBox}>
                {typeof experience.revenue_share.host_percent === 'number' && (
                  <span>{t('experiences.revenueHost', { percent: experience.revenue_share.host_percent })}</span>
                )}
                {typeof experience.revenue_share.community_percent === 'number' && (
                  <span>
                    {t('experiences.revenueCommunity', { percent: experience.revenue_share.community_percent })}
                  </span>
                )}
                {experience.revenue_share.notes && (
                  <p className={styles.revenueNotes}>{experience.revenue_share.notes}</p>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {typeof experience.price_amount === 'number' ? (
              <p className={styles.priceInfo}>
                {experience.price_amount.toLocaleString('fr-FR')} {experience.price_currency}
              </p>
            ) : (
              <p className={styles.priceInfo}>{t('experiences.priceOnRequest')}</p>
            )}
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                <ExternalLink size={15} strokeWidth={2} />
                <span>{t('destinations.openInMaps')}</span>
              </a>
            )}
          </div>
          <ReportErrorButton itemType="experience" itemId={experience.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/experiences" />
    </div>
  );
}
