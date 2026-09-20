import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Navigation } from 'lucide-react';

import styles from './MobilityHero.module.css';

interface MobilityHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function MobilityHero({ query, onQueryChange, onSubmit }: MobilityHeroProps) {
  const { t } = useTranslation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Navigation size={13} strokeWidth={2} aria-hidden="true" />
          {t('mobility.badge')}
        </span>

        <h1 className={styles.title}>{t('mobility.title')}</h1>
        <p className={styles.subtitle}>{t('mobility.subtitle')}</p>

        <form className={styles.searchBar} onSubmit={handleSubmit} autoComplete="off">
          <Search size={19} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            placeholder={t('mobility.searchPlaceholder')}
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
