import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageOff, User, MapPin } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal, ExpandableText } from '../../../shared/ui';
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
            <Reveal as="section" className={styles.section}>
              <audio controls className={styles.mediaPlayer} src={content.media_url} />
            </Reveal>
          )}
          {content.media_type === 'video' && content.media_url && (
            <Reveal as="section" className={styles.section}>
              <div className={styles.videoWrap}>
                <video controls className={styles.mediaVideo} src={content.media_url} />
              </div>
            </Reveal>
          )}

          {content.summary && (
            <Reveal as="section" className={styles.section}>
              <span className={styles.sectionKicker}>{t('culture.detailKickerSummary')}</span>
              <ExpandableText text={content.summary} lines={4} textClassName={styles.summary} />
            </Reveal>
          )}

          {content.content && (
            <Reveal as="section" className={styles.section}>
              <span className={styles.sectionKicker}>{t('culture.detailKickerStory')}</span>
              <ExpandableText text={content.content} lines={8} textClassName={styles.contentText} />
            </Reveal>
          )}

          {relatedDestinations.length > 0 && (
            <Reveal as="section" className={styles.section}>
              <span className={styles.sectionKicker}>{t('culture.relatedDestinationsKicker')}</span>
              <h2 className={styles.sectionTitle}>{t('culture.relatedDestinations')}</h2>
              <div className={styles.relatedGrid}>
                {relatedDestinations.map((destination, i) => (
                  <Reveal key={destination.id} delay={Math.min(i, 6) * 60}>
                    <DestinationCard destination={destination} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <RelatedModules currentPath="/culture" />
    </div>
  );
}
