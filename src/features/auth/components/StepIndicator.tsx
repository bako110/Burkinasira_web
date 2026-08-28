import { Check } from 'lucide-react';
import clsx from 'clsx';

import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  total: number;
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className={styles.row} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
        const isDone = step < current;
        const isActive = step === current;
        return (
          <div key={step} className={styles.item}>
            <span className={clsx(styles.dot, isDone && styles.dotDone, isActive && styles.dotActive)}>
              {isDone ? <Check size={13} strokeWidth={3} /> : step}
            </span>
            {step < total && <span className={clsx(styles.line, isDone && styles.lineDone)} />}
          </div>
        );
      })}
    </div>
  );
}
