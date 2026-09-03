import { useState } from 'react';
import { Star } from 'lucide-react';

import styles from './StarRating.module.css';

interface StarRatingProps {
  /** Note affichée (peut être décimale en lecture seule). */
  value: number;
  /** Taille d'une étoile en px. */
  size?: number;
  /** Si fourni, le composant devient un champ de saisie 1-5. */
  onChange?: (value: number) => void;
  /** Libellé accessible du groupe (mode saisie). */
  label?: string;
}

export function StarRating({ value, size = 18, onChange, label }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const editable = typeof onChange === 'function';
  const shown = hover ?? value;

  if (!editable) {
    return (
      <span className={styles.row} aria-label={`${value.toFixed(1)} / 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={2}
            className={styles.star}
            fill={i <= Math.round(value) ? 'currentColor' : 'none'}
          />
        ))}
      </span>
    );
  }

  return (
    <span className={styles.row} role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={styles.button}
          role="radio"
          aria-checked={value === i}
          aria-label={String(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          onClick={() => onChange(i)}
        >
          <Star
            size={size}
            strokeWidth={2}
            className={styles.star}
            fill={i <= shown ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </span>
  );
}
