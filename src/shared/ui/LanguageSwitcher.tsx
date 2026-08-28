import { useTranslation } from 'react-i18next';

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/config';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      className={styles.select}
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value as SupportedLanguage)}
      aria-label="Language"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}
