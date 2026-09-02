import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import styles from './AppLayout.module.css';

interface DrawerNavLink {
  to: string;
  key: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface DrawerNavSectionProps {
  label: string;
  links: readonly DrawerNavLink[];
  collapsedCount: number;
  onNavigate: () => void;
}

export function DrawerNavSection({ label, links, collapsedCount, onNavigate }: DrawerNavSectionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const hasMore = links.length > collapsedCount;
  const visibleLinks = expanded ? links : links.slice(0, collapsedCount);

  return (
    <div className={styles.drawerGroup}>
      <span className={styles.drawerSectionLabel}>{label}</span>
      <nav className={styles.drawerNav}>
        {visibleLinks.map(({ to, key, Icon }) => (
          <NavLink key={key} to={to} className={styles.drawerLink} onClick={onNavigate}>
            <Icon size={18} strokeWidth={2} className={styles.drawerLinkIcon} />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
        {hasMore && (
          <button
            type="button"
            className={styles.drawerMoreBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={clsx(styles.drawerMoreIcon, expanded && styles.drawerMoreIconOpen)}
            />
            {expanded ? t('common.seeLess') : t('common.seeMore')}
          </button>
        )}
      </nav>
    </div>
  );
}
