import { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import styles from './ExpandableText.module.css';

interface ExpandableTextProps {
  text: string;
  /** Nombre de lignes visibles avant troncature. */
  lines?: number;
  className?: string;
  textClassName?: string;
}

/**
 * Tronque un long texte à `lines` lignes avec un bouton "Voir plus / Voir
 * moins". Le bouton n'apparaît que si le texte dépasse réellement la
 * hauteur tronquée (mesuré après montage).
 */
export function ExpandableText({ text, lines = 6, className, textClassName }: ExpandableTextProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    setOverflowing(node.scrollHeight > node.clientHeight + 1);
  }, [text, lines]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className={clsx(textClassName, styles.text, !expanded && styles.clamped)}
        style={!expanded ? ({ '--lines': lines } as React.CSSProperties) : undefined}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button type="button" className={styles.toggle} onClick={() => setExpanded((v) => !v)}>
          {expanded ? t('common.seeLess') : t('common.seeMore')}
        </button>
      )}
    </div>
  );
}
