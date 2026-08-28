import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageOff, User, MapPin } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { DestinationCard } from '../../destinations/components/DestinationCard';
import { useCultureContentDetail } from '../hooks/useCultureContentDetail';
import { useRelatedDestinations } from '../hooks/useRelatedDestinations';
import styles from './CultureContentDetailPage.module.css';

export function CultureContentDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: content, isLoading, isError, refetch } = useCultureContentDetail(id);
  const { destinations: relatedDestinations } = useRelatedDestinations(content?.related_destination_ids);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('culture.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/culture')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.culture')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {content.cover_photo ? (
          <img src={content.cover_photo} alt={content.title} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/culture" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`culture.types.${content.type}`, content.type)}</span>
          <h1 className={styles.title}>{content.title}</h1>
          <div className={styles.heroMeta}>
            {content.author && (
              <span className={styles.author}>
                <User size={14} strokeWidth={2} />
                {content.author}
              </span>
            )}
            {content.region && (
              <span className={styles.author}>
                <MapPin size={14} strokeWidth={2} />
                {content.region}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {content.media_type === 'audio' && content.media_url && (
            <audio controls className={styles.mediaPlayer} src={content.media_url} />
          )}
          {content.media_type === 'video' && content.media_url && (
            <video controls className={styles.mediaPlayer} src={content.media_url} />
          )}

          {content.summary && (
            <section className={styles.section}>
              <p className={styles.summary}>{content.summary}</p>
            </section>
          )}

          {content.content && (
            <section className={styles.section}>
              <p className={styles.contentText}>{content.content}</p>
            </section>
          )}

          {relatedDestinations.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('culture.relatedDestinations')}</h2>
              <div className={styles.relatedGrid}>
                {relatedDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <RelatedModules currentPath="/culture" />
    </div>
  );
}
