import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Coins, FileCheck2, HeartPulse, Bus, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { Spinner, EmptyResults } from '../../../shared/ui';
import { useGuideEntries } from '../hooks/useGuideEntries';
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
  const [openCategory, setOpenCategory] = useState<FirstVisitGuideCategory | null>(null);

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

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('international.title')}</h1>
          <p className={styles.subtitle}>{t('international.subtitle')}</p>
        </div>

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
          <div className={styles.categoryList}>
            {CATEGORIES.map(({ key, Icon }) => {
              const categoryEntries = grouped.get(key) ?? [];
              if (categoryEntries.length === 0) return null;
              const isOpen = openCategory === key;

              return (
                <div key={key} className={styles.categoryCard}>
                  <button
                    type="button"
                    className={styles.categoryHeader}
                    onClick={() => setOpenCategory(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.categoryHeaderLeft}>
                      <Icon size={20} strokeWidth={2} />
                      {t(`international.categories.${key}`)}
                    </span>
                    <ChevronDown size={18} strokeWidth={2} className={clsx(styles.chevron, isOpen && styles.chevronOpen)} />
                  </button>

                  {isOpen && (
                    <div className={styles.categoryContent}>
                      {categoryEntries.map((entry) => (
                        <div key={entry.id} className={styles.entry}>
                          <h3 className={styles.entryTitle}>{entry.title}</h3>
                          <p className={styles.entryContent}>{entry.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
