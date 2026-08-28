import { type FormEvent, type ReactNode } from 'react';
import { Search } from 'lucide-react';

import styles from './ListingHero.module.css';

interface ListingHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchLabel: string;
  searchButtonLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  extra?: ReactNode;
}

export function ListingHero({
  title,
  subtitle,
  searchPlaceholder,
  searchLabel,
  searchButtonLabel,
  query,
  onQueryChange,
  onSubmit,
  extra,
}: ListingHeroProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <form className={styles.searchBar} onSubmit={handleSubmit}>
          <Search size={19} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label={searchLabel}
          />
          <button type="submit" className={styles.searchButton}>
            {searchButtonLabel}
          </button>
        </form>

        {extra}
      </div>
    </section>
  );
}
