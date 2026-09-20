import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users } from 'lucide-react';

import styles from './DiasporaHero.module.css';

interface DiasporaHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function DiasporaHero({ query, onQueryChange, onSubmit }: DiasporaHeroProps) {
  const { t } = useTranslation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Users size={13} strokeWidth={2} aria-hidden="true" />
          {t('nav.diaspora')}
        </span>

        <h1 className={styles.title}>{t('diaspora.title')}</h1>
        <p className={styles.subtitle}>{t('diaspora.subtitle')}</p>

        <form className={styles.searchBar} onSubmit={handleSubmit} autoComplete="off">
          <Search size={19} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            placeholder={t('diaspora.searchPlaceholder')}
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
