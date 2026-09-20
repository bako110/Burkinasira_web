import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Coins, FileCheck2, HeartPulse, Bus, BookOpen } from 'lucide-react';
import clsx from 'clsx';

import { Spinner, EmptyResults, Reveal, RelatedModules } from '../../../shared/ui';
import { useGuideEntries } from '../hooks/useGuideEntries';
import { FirstVisitHero } from '../components/FirstVisitHero';
import type { FirstVisitGuideCategory, GuideEntry } from '../types';
import styles from './FirstVisitGuidePage.module.css';

const CATEGORIES: { key: FirstVisitGuideCategory; Icon: typeof Landmark }[] = [
  { key: 'culture_usages', Icon: Landmark },
  { key: 'monnaie', Icon: Coins },
  { key: 'formalites', Icon: FileCheck2 },
  { key: 'sante_securite', Icon: HeartPulse },
  { key: 'transport', Icon: Bus },
];

export function FirstVisitGuidePage() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<FirstVisitGuideCategory | null>(null);

  const appLanguage = i18n.language;
  const { data, isLoading, isError, refetch } = useGuideEntries(appLanguage);
  const { data: fallbackData } = useGuideEntries('fr', undefined);

  const entries = useMemo(() => {
    if (data && data.length > 0) return data;
    if (appLanguage !== 'fr' && fallbackData) return fallbackData;
    return data ?? [];
  }, [data, fallbackData, appLanguage]);

  const grouped = useMemo(() => {
    const map = new Map<FirstVisitGuideCategory, GuideEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return map;
  }, [entries]);

  const availableCategories = CATEGORIES.filter(({ key }) => (grouped.get(key) ?? []).length > 0);

  return (
    <div className={styles.page}>
      <FirstVisitHero chips={availableCategories} />

      <div className={styles.body}>
        {isLoading && (
          <div className={styles.centerRow}>
            <Spinner size={32} />
          </div>
        )}

        {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!isLoading && !isError && entries.length === 0 && (
          <EmptyResults variant="empty" title={t('international.empty')} text={t('explore.emptyText')} />
        )}

        {!isLoading && !isError && entries.length > 0 && (
          <div className={styles.layout}>
            <aside className={styles.tocCol}>
              <nav className={styles.toc} aria-label={t('international.title')}>
                <span className={styles.tocKicker}>
                  <BookOpen size={13} strokeWidth={2} />
                  {t('international.summary')}
                </span>

                <div className={styles.tocItems}>
                  {availableCategories.map(({ key, Icon }, i) => (
                    <a
                      key={key}
                      href={`#guide-${key}`}
                      className={clsx(styles.tocItem, activeCategory === key && styles.tocItemActive)}
                      onClick={() => setActiveCategory(key)}
                    >
                      <span className={styles.tocNum}>{String(i + 1).padStart(2, '0')}</span>
                      <Icon size={16} strokeWidth={2} />
                      <span className={styles.tocLabel}>{t(`international.categories.${key}`)}</span>
                    </a>
                  ))}
                </div>
              </nav>
            </aside>

            <div className={styles.categoryList}>
              {availableCategories.map(({ key, Icon }, ci) => {
                const categoryEntries = grouped.get(key) ?? [];

                return (
                  <section key={key} id={`guide-${key}`} className={styles.categoryAnchor}>
                    <Reveal as="section" delay={Math.min(ci, 4) * 60} className={styles.categoryBlock}>
                      <header className={styles.categoryHeader}>
                        <span className={styles.categoryIcon} aria-hidden="true">
                          <Icon size={24} strokeWidth={1.75} />
                        </span>
                        <div className={styles.categoryHeadings}>
                          <span className={styles.sectionKicker}>
                            {t('international.categoryStep')} {String(ci + 1).padStart(2, '0')}
                          </span>
                          <h2 className={styles.sectionTitle}>
                            {t(`international.categories.${key}`)}
                          </h2>
                          <span className={styles.categoryCount}>
                            {t('international.entryCount', { count: categoryEntries.length })}
                          </span>
                        </div>
                      </header>

                      <div className={styles.entries}>
                        {categoryEntries.map((entry, ei) => (
                          <article key={entry.id} className={styles.entry}>
                            <span className={styles.entryIndex} aria-hidden="true">
                              {String(ei + 1).padStart(2, '0')}
                            </span>
                            <div className={styles.entryMain}>
                              <h3 className={styles.entryTitle}>{entry.title}</h3>
                              <p className={styles.entryContent}>{entry.content}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </Reveal>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        <RelatedModules currentPath="/international" />
      </div>
    </div>
  );
}
