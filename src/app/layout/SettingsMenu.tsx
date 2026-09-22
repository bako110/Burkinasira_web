import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import clsx from 'clsx';

import { ThemeToggle } from '../../shared/ui';
import styles from './SettingsMenu.module.css';

export function SettingsMenu() {
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
        aria-label={t('common.settings')}
      >
        <Settings size={18} strokeWidth={2} />
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>{t('common.appearance')}</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
