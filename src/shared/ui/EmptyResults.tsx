import { useTranslation } from 'react-i18next';
import { SearchX, WifiOff } from 'lucide-react';

import { Button } from './Button';
import styles from './EmptyResults.module.css';

interface EmptyResultsProps {
  variant: 'empty' | 'error';
  title?: string;
  text?: string;
  onReset?: () => void;
  onRetry?: () => void;
}

export function EmptyResults({ variant, title, text, onReset, onRetry }: EmptyResultsProps) {
  const { t } = useTranslation();
  const isError = variant === 'error';

  return (
    <div className={styles.wrap}>
      <span className={styles.iconWrap}>
        {isError ? (
          <WifiOff size={28} strokeWidth={1.75} />
        ) : (
          <SearchX size={28} strokeWidth={1.75} />
        )}
      </span>
      <p className={styles.title}>{title ?? (isError ? t('common.error') : t('destinations.empty'))}</p>
      <p className={styles.text}>{text ?? (isError ? t('explore.errorText') : t('explore.emptyText'))}</p>
      {isError && onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
      {!isError && onReset && (
        <Button variant="secondary" onClick={onReset}>
          {t('explore.resetFilters')}
        </Button>
      )}
    </div>
  );
}
