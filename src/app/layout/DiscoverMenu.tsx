import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  BedDouble,
  UtensilsCrossed,
  Bus,
  Compass,
  PartyPopper,
  Stethoscope,
  ShieldAlert,
  Landmark,
  Wifi,
  ScrollText,
  ShoppingBasket,
  CloudSun,
  Users,
} from 'lucide-react';
import clsx from 'clsx';

import styles from './DiscoverMenu.module.css';

const DISCOVER_LINKS = [
  { to: '/hotels', key: 'hotels', Icon: BedDouble },
  { to: '/restaurants', key: 'restaurants', Icon: UtensilsCrossed },
  { to: '/mobility', key: 'mobility', Icon: Bus },
  { to: '/guides', key: 'guides', Icon: Compass },
  { to: '/events', key: 'events', Icon: PartyPopper },
  { to: '/culture', key: 'culture', Icon: ScrollText },
  { to: '/market', key: 'market', Icon: ShoppingBasket },
  { to: '/community', key: 'community', Icon: Users },
] as const;

const PRACTICAL_LINKS = [
  { to: '/health', key: 'health', Icon: Stethoscope },
  { to: '/emergency', key: 'emergency', Icon: ShieldAlert },
  { to: '/finance', key: 'finance', Icon: Landmark },
  { to: '/connectivity', key: 'connectivity', Icon: Wifi },
  { to: '/weather', key: 'weather', Icon: CloudSun },
] as const;

export function DiscoverMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.triggerActive)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {t('nav.discover')}
        <ChevronDown size={15} strokeWidth={2} className={clsx(styles.chevron, open && styles.chevronOpen)} />
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.column}>
            <span className={styles.columnLabel}>{t('nav.discover')}</span>
            {DISCOVER_LINKS.map(({ to, key, Icon }) => (
              <NavLink key={key} to={to} className={styles.link} onClick={() => setOpen(false)}>
                <Icon size={17} strokeWidth={2} className={styles.linkIcon} />
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </div>
          <div className={styles.column}>
            <span className={styles.columnLabel}>{t('nav.practical')}</span>
            {PRACTICAL_LINKS.map(({ to, key, Icon }) => (
              <NavLink key={key} to={to} className={styles.link} onClick={() => setOpen(false)}>
                <Icon size={17} strokeWidth={2} className={styles.linkIcon} />
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
