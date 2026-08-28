import { Link } from 'react-router-dom';
import { ImageOff, FileText, Headphones, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { CultureContentSummary } from '../types';
import styles from './CultureCard.module.css';

const MEDIA_ICON = { texte: FileText, audio: Headphones, video: Video };

export function CultureCard({ content }: { content: CultureContentSummary }) {
  const { t } = useTranslation();
  const MediaIcon = MEDIA_ICON[content.media_type];

  return (
    <Link to={`/culture/${content.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.imageWrap}>
          {content.cover_photo ? (
            <img src={content.cover_photo} alt={content.title} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <span className={styles.mediaBadge}>
            <MediaIcon size={12} strokeWidth={2} />
          </span>
          <span className={styles.typeBadge}>{t(`culture.types.${content.type}`, content.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{content.title}</h3>
          {content.summary && <p className={styles.summary}>{content.summary}</p>}
          {content.author && <span className={styles.author}>{content.author}</span>}
        </div>
      </Card>
    </Link>
  );
}
