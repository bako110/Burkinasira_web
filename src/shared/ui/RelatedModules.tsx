import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { getRelatedModules } from '../config/modules';
import styles from './RelatedModules.module.css';

const TONES = ['tone1', 'tone2', 'tone3', 'tone4'] as const;

export function RelatedModules({ currentPath }: { currentPath: string }) {
  const { t } = useTranslation();
  const links = getRelatedModules(currentPath);

  if (links.length === 0) return null;

  return (
    <section className={styles.wrap} aria-labelledby="related-modules-title">
      <div className={styles.head}>
        <h2 id="related-modules-title" className={styles.title}>
          {t('common.exploreAlso')}
        </h2>
        <p className={styles.subtitle}>{t('common.exploreAlsoSubtitle')}</p>
      </div>

      <div className={styles.grid}>
        {links.map(({ to, labelKey, Icon }, i) => (
          <Link key={to} to={to} className={styles.tile} data-tone={TONES[i % TONES.length]}>
            <Icon size={96} strokeWidth={1} className={styles.watermark} aria-hidden="true" />
            <span className={styles.iconWrap}>
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowUpRight size={18} strokeWidth={2.25} />
            </span>
            <span className={styles.label}>{t(labelKey)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
