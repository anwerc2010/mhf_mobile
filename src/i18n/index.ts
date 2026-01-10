import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Get initial language from storage or default to 'en'
const getInitialLanguage = (): 'en' | 'ar' => {
  // You can add AsyncStorage here to persist language preference
  // For now, defaulting to 'en'
  return 'en';
};

const initialLanguage = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Sync i18n with Redux store language
export const syncLanguageWithStore = (language: 'en' | 'ar') => {
  i18n.changeLanguage(language);
};

export default i18n;

