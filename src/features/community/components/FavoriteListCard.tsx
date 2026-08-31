import { useTranslation } from 'react-i18next';
import { Trash2, MapPin, Bookmark } from 'lucide-react';

import type { FavoriteList } from '../types';
import styles from './FavoriteListCard.module.css';

interface FavoriteListCardProps {
  list: FavoriteList;
  onDelete: (id: string) => void;
}

export function FavoriteListCard({ list, onDelete }: FavoriteListCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.cover}>
        <Bookmark size={28} strokeWidth={1.5} />
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
          <span className={styles.name}>{list.name}</span>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(list.id)}
            aria-label={t('common.delete')}
          >
            <Trash2 size={15} strokeWidth={2} />
          </button>
        </div>
        <span className={styles.count}>
          <MapPin size={13} strokeWidth={2} />
          {t('community.destinationsCount', { count: list.destination_ids.length })}
        </span>
      </div>
    </div>
  );
}
