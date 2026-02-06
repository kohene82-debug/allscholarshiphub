import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import ptTranslations from './locales/pt.json';
import deTranslations from './locales/de.json';
import arTranslations from './locales/ar.json';
import zhTranslations from './locales/zh.json';

const resources = {
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
  pt: { translation: ptTranslations },
  de: { translation: deTranslations },
  ar: { translation: arTranslations },
  zh: { translation: zhTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
