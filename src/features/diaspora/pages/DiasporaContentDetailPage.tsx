import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Globe2, ArrowLeft, ExternalLink } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Reveal } from '../../../shared/ui';
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

  const paragraphs = content.description
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/diaspora" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>
            <Globe2 size={13} strokeWidth={2} />
            {t(`diaspora.types.${content.type}`, content.type)}
          </span>
          <h1 className={styles.title}>{content.title}</h1>
          {content.region && (
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {content.region}
              </span>
            </div>
          )}
          <span className={styles.heroRule} aria-hidden="true" />
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          <Reveal as="section" className={styles.section}>
            <span className={styles.sectionKicker}>{t('diaspora.title')}</span>
            <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
            <div className={styles.prose}>
              {paragraphs.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <hr className={styles.divider} />

          <Reveal as="section" className={styles.section} delay={80}>
            <span className={styles.sectionKicker}>{t('common.exploreAlso')}</span>
            <p className={styles.pullQuote}>{t('diaspora.subtitle')}</p>
          </Reveal>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <span className={styles.infoCardKicker}>
              <Globe2 size={14} strokeWidth={2} />
              {t('common.practicalInfo')}
            </span>
            <div className={styles.contactList}>
              <div className={styles.contactRow}>
                <Globe2 size={15} strokeWidth={2} />
                <span>{t(`diaspora.types.${content.type}`, content.type)}</span>
              </div>
              {content.region && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{content.region}</span>
                </div>
              )}
            </div>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.ctaBtnSecondary}>
                <ExternalLink size={16} strokeWidth={2} />
                {t('destinations.openInMaps')}
              </a>
            )}
          </div>
          <ReportErrorButton itemType="diaspora_content" itemId={content.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/diaspora" />
    </div>
  );
}
