import clsx from 'clsx';

import { BurkinaFlag } from './BurkinaFlag';
import styles from './FloatingFlags.module.css';

interface FloatingFlagsProps {
  /** 'bold' for dark/photo backgrounds, 'subtle' for light backgrounds */
  tone?: 'bold' | 'subtle';
  className?: string;
}

export function FloatingFlags({ tone = 'bold', className }: FloatingFlagsProps) {
  return (
    <div className={clsx(styles.wrap, className)} aria-hidden="true">
      <BurkinaFlag className={clsx(styles.flag, styles.flagBottomLeft, tone === 'subtle' && styles.subtle)} />
      <BurkinaFlag className={clsx(styles.flag, styles.flagTopRight, tone === 'subtle' && styles.subtle)} />
    </div>
  );
}
