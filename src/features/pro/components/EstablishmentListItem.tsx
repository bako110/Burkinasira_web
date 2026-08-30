import { type ReactNode } from 'react';
import { ImageOff, BarChart3, Pencil, Trash2, Star } from 'lucide-react';
import clsx from 'clsx';

import styles from './EstablishmentListItem.module.css';

interface EstablishmentListItemProps {
  name: string;
  photo?: string;
  typeLabel?: string;
  meta: ReactNode;
  priceLabel?: string;
  rating?: number;
  reviewCount?: number;
  status?: string;
  statusLabel?: string;
  onViewAnalytics: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export function EstablishmentListItem({
  name,
  photo,
  typeLabel,
  meta,
  priceLabel,
  rating,
  reviewCount,
  status,
  statusLabel,
  onViewAnalytics,
  onEdit,
  onDelete,
}: EstablishmentListItemProps) {
  const statusClass = status ? styles[`status${status.charAt(0).toUpperCase()}${status.slice(1)}`] : undefined;
  const hasRating = typeof rating === 'number' && rating > 0;

  return (
    <div className={styles.item}>
      <div className={styles.thumb}>
        {photo ? <img src={photo} alt="" /> : <ImageOff size={18} strokeWidth={1.5} />}
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h4 className={styles.name}>{name}</h4>
          {status && <span className={clsx(styles.statusBadge, statusClass)}>{statusLabel ?? status}</span>}
        </div>
        <div className={styles.meta}>
          {typeLabel && <span className={styles.typeTag}>{typeLabel}</span>}
          {meta}
          {hasRating && (
            <span className={styles.rating}>
              <Star size={12} strokeWidth={2} fill="currentColor" />
              {rating!.toFixed(1)}
              {typeof reviewCount === 'number' && reviewCount > 0 && (
                <span className={styles.reviewCount}>({reviewCount})</span>
              )}
            </span>
          )}
          {priceLabel && <span className={styles.price}>{priceLabel}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={onViewAnalytics} aria-label="Analytics">
          <BarChart3 size={16} strokeWidth={2} />
        </button>
        <button type="button" className={styles.actionBtn} onClick={onEdit} aria-label="Modifier">
          <Pencil size={16} strokeWidth={2} />
        </button>
        {onDelete && (
          <button type="button" className={styles.actionBtn} onClick={onDelete} aria-label="Supprimer">
            <Trash2 size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
