import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { DiasporaContent } from '../types';
import { TYPE_META } from './typeMeta';
import styles from './DiasporaContentCard.module.css';

export function DiasporaContentCard({ content }: { content: DiasporaContent }) {
  const { t } = useTranslation();
  const meta = TYPE_META[content.type];
  const Icon = meta?.Icon ?? Globe2;

  return (
    <Link to={`/diaspora/${content.id}`} className={styles.link}>
      <article className={styles.card} data-tone={meta?.tone ?? 'orange'}>
        <div className={styles.cover}>
          <Icon size={88} strokeWidth={1} className={styles.coverWatermark} aria-hidden="true" />
          <span className={styles.coverIcon}>
            <Icon size={26} strokeWidth={1.75} />
          </span>
          <span className={styles.typeBadge}>{t(`diaspora.types.${content.type}`, content.type)}</span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.name}>{content.title}</h3>
          {content.description && <p className={styles.description}>{content.description}</p>}

          <div className={styles.footer}>
            {content.region ? (
              <span className={styles.location}>
                <MapPin size={13} strokeWidth={2} />
                {content.region}
              </span>
            ) : (
              <span />
            )}
            <span className={styles.more}>
              {t('diaspora.hub.discover')}
              <ArrowRight size={14} strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
