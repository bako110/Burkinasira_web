import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  LayoutGrid,
  TreePine,
  Landmark,
  Palette,
  Church,
  Building2,
  Pyramid,
  House,
  ShoppingBasket,
  Trees,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

import styles from './DiscoverMenu.module.css';

const CATEGORIES = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'site_naturel', value: 'site_naturel', Icon: TreePine },
  { key: 'site_historique', value: 'site_historique', Icon: Landmark },
  { key: 'site_culturel', value: 'site_culturel', Icon: Palette },
  { key: 'site_religieux', value: 'site_religieux', Icon: Church },
  { key: 'musee', value: 'musee', Icon: Building2 },
  { key: 'monument', value: 'monument', Icon: Pyramid },
  { key: 'village_touristique', value: 'village_touristique', Icon: House },
  { key: 'marche_artisanal', value: 'marche_artisanal', Icon: ShoppingBasket },
  { key: 'parc', value: 'parc', Icon: Trees },
  { key: 'autre', value: 'autre', Icon: Sparkles },
] as const;

const CLOSE_DELAY_MS = 150;

export function ExploreMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  function cancelClose() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function handleMouseEnter() {
    cancelClose();
    setOpen(true);
  }

  function handleMouseLeave() {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  return (
    <div className={styles.wrap} ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavLink
        to="/explore"
        end
        className={({ isActive }) => clsx(styles.trigger, (isActive || open) && styles.triggerActive)}
        onClick={() => setOpen(false)}
        aria-expanded={open}
      >
        {t('nav.explore')}
        <ChevronDown size={15} strokeWidth={2} className={clsx(styles.chevron, open && styles.chevronOpen)} />
      </NavLink>

      {open && (
        <div className={styles.panel}>
          <div className={styles.column}>
            <span className={styles.columnLabel}>{t('nav.explore')}</span>
            {CATEGORIES.map(({ key, value, Icon }) => (
              <NavLink
                key={key}
                to={value ? `/explore?category=${value}` : '/explore'}
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                <Icon size={17} strokeWidth={2} className={styles.linkIcon} />
                {t(`explore.filters.${key}`)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
