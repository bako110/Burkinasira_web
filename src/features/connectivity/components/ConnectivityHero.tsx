import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Signal } from 'lucide-react';

import { DetailBackButton } from '../../../shared/ui';
import styles from './ConnectivityHero.module.css';

interface ConnectivityHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function ConnectivityHero({ query, onQueryChange, onSubmit }: ConnectivityHeroProps) {
  const { t } = useTranslation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <DetailBackButton fallbackTo="/" className={styles.backBtn} />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Signal size={13} strokeWidth={2} aria-hidden="true" />
          {t('connectivity.badge')}
        </span>

        <h1 className={styles.title}>{t('connectivity.title')}</h1>
        <p className={styles.subtitle}>{t('connectivity.subtitle')}</p>

        <form className={styles.searchBar} onSubmit={handleSubmit} autoComplete="off">
          <Search size={19} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            placeholder={t('connectivity.searchPlaceholder')}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label={t('common.search')}
          />
          <button type="submit" className={styles.searchButton}>
            {t('common.search')}
          </button>
        </form>
      </div>
    </section>
  );
}
