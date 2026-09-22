import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import clsx from 'clsx';

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/config';
import styles from './LanguageMenu.module.css';

export function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = i18n.language as SupportedLanguage;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function selectLanguage(lang: SupportedLanguage) {
    i18n.changeLanguage(lang);
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.triggerActive)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('common.language')}
      >
        <Globe size={18} strokeWidth={2} />
        <span className={styles.code}>{current.toUpperCase()}</span>
      </button>

      {open && (
        <div className={styles.panel} role="listbox" aria-label={t('common.language')}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="option"
              aria-selected={lang === current}
              className={clsx(styles.option, lang === current && styles.optionActive)}
              onClick={() => selectLanguage(lang)}
            >
              {LANGUAGE_LABELS[lang]}
              {lang === current && <Check size={16} strokeWidth={2.5} className={styles.optionCheck} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
