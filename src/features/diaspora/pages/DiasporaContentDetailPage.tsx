import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Globe2, ArrowLeft, ExternalLink } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useDiasporaContentDetail } from '../hooks/useDiasporaContentDetail';
import styles from './DiasporaContentDetailPage.module.css';

export function DiasporaContentDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: content, isLoading, isError, refetch } = useDiasporaContentDetail(id);

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
          title={t('diaspora.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/diaspora')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.diaspora')}
        </Button>
      </div>
    );
  }

  const mapsUrl = content.location
    ? `https://www.google.com/maps?q=${content.location.latitude},${content.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        <div className={styles.heroPlaceholder}>
          <Globe2 size={40} strokeWidth={1.5} />
        </div>
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/diaspora" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`diaspora.types.${content.type}`, content.type)}</span>
          <h1 className={styles.title}>{content.title}</h1>
          {content.region && (
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {content.region}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
            <p className={styles.description}>{content.description}</p>
          </section>
        </div>

        <aside className={styles.sidebar}>
          {mapsUrl && (
            <div className={styles.infoCard}>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                <ExternalLink size={15} strokeWidth={2} />
                <span>{t('destinations.openInMaps')}</span>
              </a>
            </div>
          )}
          <ReportErrorButton itemType="diaspora_content" itemId={content.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/diaspora" />
    </div>
  );
}
