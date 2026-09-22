import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Compass } from 'lucide-react';

import { DetailBackButton, FloatingFlags } from '../../../shared/ui';
import styles from './ExploreHero.module.css';

interface ExploreHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function ExploreHero({ query, onQueryChange, onSubmit }: ExploreHeroProps) {
  const { t } = useTranslation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />
      <FloatingFlags tone="bold" />
      <DetailBackButton fallbackTo="/" className={styles.backBtn} />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Compass size={13} strokeWidth={2} aria-hidden="true" />
          {t('home.badge')}
        </span>

        <h1 className={styles.title}>{t('destinations.title')}</h1>
        <p className={styles.subtitle}>{t('explore.subtitle')}</p>

        <div className={styles.searchPanel}>
          <form className={styles.searchBar} onSubmit={handleSubmit} autoComplete="off">
            <Search size={20} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
            <input
              className={styles.searchInput}
              placeholder={t('home.searchPlaceholder')}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label={t('common.search')}
            />
            <button type="submit" className={styles.searchButton}>
              {t('common.search')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
