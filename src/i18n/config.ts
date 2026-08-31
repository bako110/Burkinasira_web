import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '../locales/fr.json';
import en from '../locales/en.json';
import mo from '../locales/mo.json';
import dyu from '../locales/dyu.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'mo', 'dyu'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  fr: 'Français',
  en: 'English',
  mo: 'Mooré',
  dyu: 'Dioula',
};

const STORAGE_KEY = 'fasoviva:lang';

function getInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }
  return 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    mo: { translation: mo },
    dyu: { translation: dyu },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.setAttribute('lang', lng);
});

document.documentElement.setAttribute('lang', i18n.language);

export default i18n;
