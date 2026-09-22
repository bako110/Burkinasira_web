import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radio, Users } from 'lucide-react';

import { Avatar } from '../../../shared/ui';
import type { LiveSession } from '../types';
import styles from './LiveCard.module.css';

export function LiveCard({ session }: { session: LiveSession }) {
  const { t } = useTranslation();

  return (
    <Link to={`/community/live/${session.id}`} className={styles.card}>
      <div className={styles.thumb}>
        <span className={styles.liveBadge}>
          <Radio size={11} strokeWidth={2.5} />
          {t('community.liveBadge')}
        </span>
        <span className={styles.viewerBadge}>
          <Users size={11} strokeWidth={2} />
          {session.viewer_count}
        </span>
      </div>
      <div className={styles.info}>
        <Avatar src={session.host_avatar_url} name={session.host_name ?? ''} size={32} />
        <div className={styles.textCol}>
          <span className={styles.title}>{session.title}</span>
          <span className={styles.hostName}>{session.host_name}</span>
        </div>
      </div>
    </Link>
  );
}
