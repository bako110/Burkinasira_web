import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { getRelatedModules } from '../config/modules';
import styles from './RelatedModules.module.css';

export function RelatedModules({ currentPath }: { currentPath: string }) {
  const { t } = useTranslation();
  const links = getRelatedModules(currentPath);

  if (links.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{t('common.exploreAlso')}</span>
      <div className={styles.row}>
        {links.map(({ to, labelKey, Icon }) => (
          <Link key={to} to={to} className={styles.card}>
            <span className={styles.icon}>
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className={styles.text}>{t(labelKey)}</span>
            <ArrowRight size={15} strokeWidth={2} className={styles.arrow} />
          </Link>
        ))}
      </div>
    </div>
  );
}
