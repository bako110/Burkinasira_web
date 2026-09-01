import { Link } from 'react-router-dom';
import { MapPin, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { DiasporaContent } from '../types';
import styles from './DiasporaContentCard.module.css';

export function DiasporaContentCard({ content }: { content: DiasporaContent }) {
  const { t } = useTranslation();

  return (
    <Link to={`/diaspora/${content.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <Globe2 size={32} strokeWidth={1.5} />
          <span className={styles.categoryBadge}>{t(`diaspora.types.${content.type}`, content.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{content.title}</h3>
          {content.region && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {content.region}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
