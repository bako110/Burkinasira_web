import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ImageOff } from 'lucide-react';

import { FloatingFlags, Spinner } from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useDestinations } from '../../destinations/hooks/useDestinations';
import styles from './Hero.module.css';

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(query, 350);
  const showSuggestions = focused && debouncedQuery.trim().length >= 2;

  const { data, isFetching } = useDestinations({
    q: debouncedQuery.trim(),
    page_size: 5,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setFocused(false);
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore');
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />
      <FloatingFlags tone="bold" />

      <div className={styles.content}>
        <span className={styles.badge}>{t('home.badge')}</span>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>{t('home.titleLine1')}</span>
          <span className={styles.titleAccent}>{t('home.titleLine2')}</span>
        </h1>

        <p className={styles.subtitle}>{t('home.subtitle')}</p>

        <div className={styles.searchWrap} ref={wrapRef}>
          <form className={styles.searchBar} onSubmit={handleSearch} autoComplete="off">
            <Search size={20} strokeWidth={2} className={styles.searchIcon} aria-hidden="true" />
            <input
              className={styles.searchInput}
              placeholder={t('home.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              aria-label={t('common.search')}
            />
            <button type="submit" className={styles.searchButton}>
              {t('common.search')}
            </button>
          </form>

          {showSuggestions && (
            <div className={styles.suggestions}>
              {isFetching && (
                <div className={styles.suggestionsLoading}>
                  <Spinner size={18} />
                </div>
              )}

              {!isFetching && data && data.items.length > 0 && (
                <>
                  {data.items.map((destination) => (
                    <Link
                      key={destination.id}
                      to={`/explore/${destination.slug}`}
                      className={styles.suggestionItem}
                      onClick={() => setFocused(false)}
                    >
                      <span className={styles.suggestionThumb}>
                        {destination.photo ? (
                          <img src={destination.photo} alt="" />
                        ) : (
                          <ImageOff size={16} strokeWidth={1.75} />
                        )}
                      </span>
                      <span className={styles.suggestionText}>
                        <span className={styles.suggestionName}>{destination.name}</span>
                        <span className={styles.suggestionMeta}>
                          {[destination.city, destination.region].filter(Boolean).join(', ')}
                        </span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    to={`/explore?q=${encodeURIComponent(query)}`}
                    className={styles.suggestionSeeAll}
                    onClick={() => setFocused(false)}
                  >
                    {t('home.seeAllResults', { query })}
                  </Link>
                </>
              )}

              {!isFetching && data && data.items.length === 0 && (
                <p className={styles.suggestionsEmpty}>{t('home.noSuggestions')}</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.quickTags}>
          {(t('home.quickTags', { returnObjects: true }) as string[]).map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.tag}
              onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.floatCardLeft} aria-hidden="true">
        <MapPin size={16} strokeWidth={2} />
        <div>
          <strong>47</strong>
          <span>{t('home.floatProvinces')}</span>
        </div>
      </div>

      <div className={styles.floatCardRight} aria-hidden="true">
        <div className={styles.floatStars}>
          <Star size={13} strokeWidth={2} fill="currentColor" />
          <Star size={13} strokeWidth={2} fill="currentColor" />
          <Star size={13} strokeWidth={2} fill="currentColor" />
          <Star size={13} strokeWidth={2} fill="currentColor" />
          <Star size={13} strokeWidth={2} fill="currentColor" />
        </div>
        <span>{t('home.floatRating')}</span>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollDot} />
      </div>
    </section>
  );
}
