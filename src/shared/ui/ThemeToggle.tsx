import { useTranslation } from 'react-i18next';

import { useThemeStore, type ThemeMode } from '../../store/theme.store';
import styles from './ThemeToggle.module.css';

const MODES: ThemeMode[] = ['light', 'dark', 'system'];

export function ThemeToggle() {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <div className={styles.group} role="radiogroup" aria-label={t('theme.system')}>
      {MODES.map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={mode === m}
          className={mode === m ? styles.active : styles.option}
          onClick={() => setMode(m)}
          type="button"
        >
          {t(`theme.${m}`)}
        </button>
      ))}
    </div>
  );
}
